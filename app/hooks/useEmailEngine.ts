import { useState, useEffect } from "react";
import { CompatibilityIssue } from "../utils/interfaces"; // Ajustá esta ruta si es necesario

export const TEMPLATES = {
  empty: { html: "", css: "" },
  button: {
    html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">\n  <tr>\n    <td align="center">\n      <a class="button">Hacé Click Aquí</a>\n    </td>\n  </tr>\n</table>`,
    css: `.button {\n  background-color: #0070f3;\n  color: #ffffff;\n  padding: 12px 24px;\n  text-decoration: none;\n  border-radius: 5px;\n  display: inline-block;\n  font-family: sans-serif;\n}`,
  },
  layout: {
    html: `<div class="container">\n  <h1>Bienvenido, Lucas</h1>\n  <p>Este es un layout minimalista de dos columnas.</p>\n  <table width="100%">\n    <tr>\n      <td class="col">Columna 1</td>\n      <td class="col">Columna 2</td>\n    </tr>\n  </table>\n</div>`,
    css: `.container { padding: 20px; font-family: sans-serif; }\n.col { background: #f4f4f4; padding: 10px; border: 1px solid #ddd; }`,
  },
};

export type TemplateKey = keyof typeof TEMPLATES;

export function useEmailEngine() {
  const [html, setHtml] = useState(TEMPLATES.layout.html);
  const [css, setCss] = useState(TEMPLATES.layout.css);
  const [targetClient, setTargetClient] = useState<"gmail" | "outlook">("gmail");
  const [processedHtml, setProcessedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleProcessEmail();
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [html, css, targetClient]);

  const handleProcessEmail = async () => {
    if (!html && !css) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/parse-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, css, targetClient }),
      });
      const data = await response.json();
      if (response.ok) {
        setIssues(data.issues);
        setProcessedHtml(data.processedHtml);
      }
    } catch (err) {
      console.error("Error en renderizado automático");
    } finally {
      setIsLoading(false);
    }
  };

  const exportCode = () => {
    const blob = new Blob([processedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${targetClient}.html`;
    a.click();
  };

  const handleTemplateChange = (key: TemplateKey) => {
    setHtml(TEMPLATES[key].html);
    setCss(TEMPLATES[key].css);
  };

  return {
    html, setHtml, css, setCss,
    targetClient, setTargetClient,
    processedHtml, issues, isLoading,
    handleTemplateChange, exportCode
  };
}