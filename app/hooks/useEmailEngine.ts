import { useState, useEffect } from "react";
import { CompatibilityIssue, TargetClient, Project } from "../utils/interfaces";

export const DEFAULT_TEMPLATES = {
  empty: { html: "", css: "" },
  button: {
    html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">\n  <tr>\n    <td align="center">\n      <a class="button">Hacé Click Aquí</a>\n    </td>\n  </tr>\n</table>`,
    css: `.button {\n  background-color: #0070f3;\n  color: #ffffff;\n  padding: 12px 24px;\n  text-decoration: none;\n  border-radius: 5px;\n  display: inline-block;\n  font-family: sans-serif;\n}`,
  },
  layout: {
    html: `<div class="container">\n  <h1>Bienvenido, Usuario</h1>\n  <p>Este es un layout minimalista de dos columnas.</p>\n  <table width="100%">\n    <tr>\n      <td class="col">Columna 1</td>\n      <td class="col">Columna 2</td>\n    </tr>\n  </table>\n</div>`,
    css: `.container { padding: 20px; font-family: sans-serif; }\n.col { background: #f4f4f4; padding: 10px; border: 1px solid #ddd; }`,
  },
};

export type TemplateKey = keyof typeof DEFAULT_TEMPLATES;

const AUTOSAVE_DELAY_MS = 2000;

export function useEmailEngine() {
  const [html, setHtml] = useState(DEFAULT_TEMPLATES.layout.html);
  const [css, setCss] = useState(DEFAULT_TEMPLATES.layout.css);
  const [targetClient, setTargetClient] = useState<TargetClient>("gmail");
  const [processedHtml, setProcessedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled project");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const refreshProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      // Progressive enhancement — the editor still works without the saved-projects list.
    }
  };

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
    } catch {
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
    setHtml(DEFAULT_TEMPLATES[key].html);
    setCss(DEFAULT_TEMPLATES[key].css);
    setCurrentProjectId(null);
    setProjectName("Untitled project");
  };

  const loadProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return;
    const { project } = await res.json();
    setHtml(project.html);
    setCss(project.css);
    setTargetClient(project.target_client);
    setCurrentProjectId(project.id);
    setProjectName(project.name);
  };

  const saveProject = async (nameOverride?: string) => {
    setIsSaving(true);
    setSaveError(null);
    const name = nameOverride ?? projectName;
    try {
      if (currentProjectId) {
        const res = await fetch(`/api/projects/${currentProjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, html, css, targetClient }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
        const { project } = await res.json();
        setProjectName(project.name);
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, html, css, targetClient }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "No se pudo guardar");
        const { project } = await res.json();
        setCurrentProjectId(project.id);
        setProjectName(project.name);
        await refreshProjects();
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const newProject = () => {
    handleTemplateChange("empty");
  };

  useEffect(() => {
    const loadProjectsOnMount = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects ?? []);
      } catch {
        // Progressive enhancement — the editor still works without the saved-projects list.
      }
    };
    loadProjectsOnMount();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleProcessEmail();
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [html, css, targetClient]);

  // Once a project has been saved at least once, keep it in sync automatically.
  useEffect(() => {
    if (!currentProjectId) return;
    const t = setTimeout(() => {
      saveProject();
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [html, css, targetClient, currentProjectId]);

  return {
    html, setHtml, css, setCss,
    targetClient, setTargetClient,
    processedHtml, issues, isLoading,
    handleTemplateChange, exportCode,
    projects, currentProjectId, projectName, setProjectName,
    isSaving, saveError, loadProject, saveProject, newProject,
  };
}
