import { useState } from "react";
import { TemplateKey } from "../hooks/useEmailEngine";

interface HeaderProps {
  isLoading: boolean;
  targetClient: "gmail" | "outlook";
  setTargetClient: (client: "gmail" | "outlook") => void;
  exportCode: () => void;
  handleTemplateChange: (key: TemplateKey) => void;
}

export default function TesterHeader({
  isLoading,
  targetClient,
  setTargetClient,
  exportCode,
  handleTemplateChange,
}: HeaderProps) {
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 relative z-50">
      {/* LADO IZQUIERDO: Título y Plantillas */}
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-200">
          EmailRender Studio
        </h1>

        {/* CUSTOM SELECT: Plantillas */}
        <div className="relative">
          <button
            onClick={() => setIsTemplateOpen(!isTemplateOpen)}
            onBlur={() => setTimeout(() => setIsTemplateOpen(false), 200)}
            className="flex items-center gap-2 text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 px-3 py-1.5 rounded-md text-zinc-300 transition-all duration-200 outline-none focus:ring-2 focus:ring-zinc-700"
          >
            {/* Ícono de Archivo/Plantilla */}
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
            {/* Flechita animada */}
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

          {/* Menú Desplegable Animado */}
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
                { id: "button", label: "Botón a prueba de balas" },
                { id: "empty", label: "Lienzo en blanco" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    handleTemplateChange(tpl.id as TemplateKey);
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

      {/* LADO DERECHO: Estado, Target y Exportar */}
      <div className="flex items-center gap-4">
        {/* Indicador de Sincronización */}
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

          {/* Menú Desplegable Animado */}
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

        {/* Botón de Exportar Animado */}
        <button
          onClick={exportCode}
          className="group relative overflow-hidden text-sm font-medium px-4 py-2 rounded bg-zinc-100 text-zinc-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Brillo interno al hacer hover */}
          <div className="absolute inset-0 w-full h-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative">Exportar HTML</span>
        </button>
      </div>
    </header>
  );
}
