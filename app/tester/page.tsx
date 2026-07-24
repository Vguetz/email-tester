"use client";

import Editor from "@monaco-editor/react";
import { useEmailEngine } from "../hooks/useEmailEngine";
import TesterHeader from "../components/TesterHeader";
import PreviewPanel from "../components/PreviewPanel";

export default function EmailTesterLogic() {
  const {
    html,
    setHtml,
    css,
    setCss,
    targetClient,
    setTargetClient,
    processedHtml,
    issues,
    isLoading,
    handleTemplateChange,
    exportCode,
    projects,
    currentProjectId,
    projectName,
    setProjectName,
    isSaving,
    saveError,
    loadProject,
    saveProject,
    newProject,
  } = useEmailEngine();

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    wordWrap: "on" as const,
  };

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden">
      <TesterHeader
        isLoading={isLoading}
        targetClient={targetClient}
        setTargetClient={setTargetClient}
        exportCode={exportCode}
        handleTemplateChange={handleTemplateChange}
        projects={projects}
        currentProjectId={currentProjectId}
        projectName={projectName}
        setProjectName={setProjectName}
        isSaving={isSaving}
        saveError={saveError}
        loadProject={loadProject}
        saveProject={saveProject}
        newProject={newProject}
      />

      <main className="flex-1 flex overflow-hidden">
        {/* Panel de Editores Monaco */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e] border-r border-zinc-800">
          <div className="flex-none h-1/3 flex flex-col border-b border-zinc-800 relative">
            <Editor
              height="100%"
              language="css"
              theme="vs-dark"
              value={css}
              onChange={(v) => setCss(v || "")}
              options={editorOptions}
            />
          </div>
          <div className="flex-1 flex flex-col relative">
            <Editor
              height="100%"
              language="html"
              theme="vs-dark"
              value={html}
              onChange={(v) => setHtml(v || "")}
              options={editorOptions}
            />
          </div>
        </div>

        <PreviewPanel processedHtml={processedHtml} issues={issues} />
      </main>
    </div>
  );
}
