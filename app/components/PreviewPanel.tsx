import { useState } from "react";
import { CompatibilityIssue } from "../utils/interfaces";

interface PreviewProps {
  processedHtml: string;
  issues: CompatibilityIssue[];
}

export default function PreviewPanel({ processedHtml, issues }: PreviewProps) {
  const [previewWidth, setPreviewWidth] = useState<"100%" | "768px" | "375px">(
    "100%",
  );
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);

  return (
    <div className="w-1/2 flex flex-col bg-zinc-950 p-8">
      <div className="flex-1 border border-zinc-800 shadow-xl rounded-sm overflow-hidden flex flex-col bg-zinc-900">
        <div className="h-10 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 relative">
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

          {/* Panel Flotante Restaurado */}
          <div
            className={`absolute top-12 left-4 w-[400px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden origin-top-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isIssuesOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-90 invisible pointer-events-none"
            }`}
          >
            <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-300">
                Consola de Compatibilidad
              </span>
              <button
                onClick={() => setIsIssuesOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
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
                      {/* Ícono de severidad */}
                      <div className="mt-0.5 shrink-0">
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

                      {/* Contenido del error */}
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

          {/* Botonera de anchos */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewWidth("100%")}
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                previewWidth === "100%"
                  ? "text-white"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewWidth("375px")}
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                previewWidth === "375px"
                  ? "text-white"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Iframe contenedor */}
        <div className="flex-1 flex justify-center bg-zinc-950 overflow-hidden relative">
          <div
            className="h-full bg-white transition-all duration-500 border-x border-zinc-800 shadow-2xl"
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
  );
}
