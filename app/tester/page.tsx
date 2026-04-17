"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { CompatibilityIssue } from "../utils/interfaces";

// 2. Definición de Plantillas Base
const TEMPLATES = {
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

export default function EmailTesterLogic() {
  const [html, setHtml] = useState(TEMPLATES.layout.html);
  const [css, setCss] = useState(TEMPLATES.layout.css);
  const [targetClient, setTargetClient] = useState<"gmail" | "outlook">(
    "gmail",
  );
  const [processedHtml, setProcessedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<"100%" | "768px" | "375px">(
    "100%",
  );

  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);

  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);

  const [isIssuesOpen, setIsIssuesOpen] = useState(false);
  // 1. Lógica de Autorenderizado con Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleProcessEmail();
    }, 800); // Espera 800ms tras el último cambio

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

  // 3. Funciones de Exportar / Importar
  const exportCode = () => {
    const blob = new Blob([processedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${targetClient}.html`;
    a.click();
  };

  const handleTemplateChange = (key: keyof typeof TEMPLATES) => {
    setHtml(TEMPLATES[key].html);
    setCss(TEMPLATES[key].css);
  };

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 relative z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-semibold tracking-tight text-zinc-200">
            EmailRender Studio
          </h1>

          {/* CUSTOM SELECT: Plantillas */}
          <div className="relative">
            <button
              onClick={() => setIsTemplateOpen(!isTemplateOpen)}
              onBlur={() => setTimeout(() => setIsTemplateOpen(false), 200)} // Hack simple para cerrar al hacer clic afuera
              className="flex items-center gap-2 text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 px-3 py-1.5 rounded-md text-zinc-300 transition-all duration-200 outline-none focus:ring-2 focus:ring-zinc-700"
            >
              <svg
                className="w-3 h-3 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Plantillas
              <svg
                className={`w-3 h-3 text-zinc-500 transition-transform duration-300 ease-out ${isTemplateOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu (Animado) */}
            <div
              className={`absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl overflow-hidden origin-top-left transition-all duration-200 ease-out ${
                isTemplateOpen
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible"
              }`}
            >
              <div className="flex flex-col py-1">
                {[
                  { id: "layout", label: "Newsletter Layout" },
                  { id: "button", label: "Botón" },
                  { id: "empty", label: "Lienzo en blanco" },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      handleTemplateChange(tpl.id as any);
                      setIsTemplateOpen(false);
                    }}
                    className="text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mr-4">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                Sincronizando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Al día
              </span>
            )}
          </div>

          {/* CUSTOM SELECT: Target Client */}
          <div className="relative">
            <button
              onClick={() => setIsTargetOpen(!isTargetOpen)}
              onBlur={() => setTimeout(() => setIsTargetOpen(false), 200)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 px-2 py-1 transition-colors outline-none"
            >
              Target:{" "}
              <span className="font-medium text-white">
                {targetClient === "gmail" ? "Gmail" : "Outlook"}
              </span>
              <svg
                className={`w-3 h-3 transition-transform duration-300 ease-out ${isTargetOpen ? "-rotate-180" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            {/* Dropdown Menu (Animado) */}
            <div
              className={`absolute top-full right-0 mt-2 w-36 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl overflow-hidden origin-top-right transition-all duration-200 ease-out ${
                isTargetOpen
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible"
              }`}
            >
              <div className="flex flex-col py-1">
                <button
                  onClick={() => {
                    setTargetClient("gmail");
                    setIsTargetOpen(false);
                  }}
                  className={`text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                    targetClient === "gmail"
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                  }`}
                >
                  Gmail
                  {targetClient === "gmail" && (
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setTargetClient("outlook");
                    setIsTargetOpen(false);
                  }}
                  className={`text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                    targetClient === "outlook"
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                  }`}
                >
                  Outlook
                  {targetClient === "outlook" && (
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={exportCode}
            className="group relative overflow-hidden text-sm font-medium px-4 py-2 rounded bg-zinc-100 text-zinc-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Animación sutil de brillo en el botón de exportar al hacer hover */}
            <div className="absolute inset-0 w-full h-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Exportar HTML</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col bg-[#1e1e1e] border-r border-zinc-800">
          <div className="flex-none h-1/3 flex flex-col border-b border-zinc-800 relative">
            <Editor
              height="100%"
              language="css"
              theme="vs-dark"
              value={css}
              onChange={(v) => setCss(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
              }}
            />
          </div>
          <div className="flex-1 flex flex-col relative">
            <Editor
              height="100%"
              language="html"
              theme="vs-dark"
              value={html}
              onChange={(v) => setHtml(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-zinc-950 p-8">
          <div className="flex-1 border border-zinc-800 shadow-xl rounded-sm overflow-hidden flex flex-col bg-zinc-900">
            <div className="h-10 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 relative">
              {/* BOTÓN TRIGGER DEL PANEL DE ERRORES */}
              <button
                onClick={() => setIsIssuesOpen(!isIssuesOpen)}
                className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  issues?.length > 0
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {issues?.length > 0 ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {issues.length} Hallazgos
                  </>
                ) : (
                  "0 Errores"
                )}
              </button>

              {/* PANEL FLOTANTE TIPO GSAP (Popover) */}
              <div
                className={`absolute top-12 left-4 w-[400px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden origin-top-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isIssuesOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-90 -translate-y-4 invisible pointer-events-none"
                }`}
              >
                <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">
                    Consola de Compatibilidad
                  </span>
                  <button
                    onClick={() => setIsIssuesOpen(false)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar bg-zinc-950/50">
                  {!issues || issues.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500 italic">
                      Todo perfecto. Tu código está limpio.
                    </div>
                  ) : (
                    <ul className="divide-y divide-zinc-800/50">
                      {issues.map((issue, idx) => (
                        <li
                          key={idx}
                          className="p-4 flex gap-3 hover:bg-zinc-900/80 transition-colors"
                        >
                          {/* Icono según severidad */}
                          <div className="mt-0.5">
                            {issue.severity === "error" ? (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700">
                                {issue.property}
                              </code>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {issue.message}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Los botones originales de Desktop/Mobile */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewWidth("100%")}
                  className={`text-[10px] uppercase tracking-widest ${previewWidth === "100%" ? "text-white" : "text-zinc-600"}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewWidth("375px")}
                  className={`text-[10px] uppercase tracking-widest ${previewWidth === "375px" ? "text-white" : "text-zinc-600"}`}
                >
                  Mobile
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center bg-zinc-950 overflow-hidden relative">
              <div
                className="h-full bg-white transition-all duration-500 ease-in-out"
                style={{ width: previewWidth }}
              >
                <iframe
                  srcDoc={processedHtml}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
