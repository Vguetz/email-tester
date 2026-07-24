import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TemplateKey } from "../hooks/useEmailEngine";
import { createClient } from "@/app/utils/supabase/client";
import { User, LogOut, Settings, Save, FolderOpen, FilePlus } from "lucide-react";
import Link from "next/link";
import { Project, TargetClient, CLIENT_LABELS } from "../utils/interfaces";

interface HeaderProps {
  isLoading: boolean;
  targetClient: TargetClient;
  setTargetClient: (client: TargetClient) => void;
  exportCode: () => void;
  handleTemplateChange: (key: TemplateKey) => void;
  projects: Project[];
  currentProjectId: string | null;
  projectName: string;
  setProjectName: (name: string) => void;
  isSaving: boolean;
  saveError: string | null;
  loadProject: (id: string) => void;
  saveProject: () => void;
  newProject: () => void;
}

export default function TesterHeader({
  isLoading,
  targetClient,
  setTargetClient,
  exportCode,
  handleTemplateChange,
  projects,
  currentProjectId,
  projectName,
  setProjectName,
  isSaving,
  saveError,
  loadProject,
  saveProject,
  newProject,
}: HeaderProps) {
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Estados para el usuario
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  // Buscar el usuario logueado al montar el componente
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
      setIsAuthLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Fuerza al middleware a re-evaluar la ruta y bloquear el acceso
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 relative z-50">
      {/* LADO IZQUIERDO: Título, Proyecto y Plantillas */}
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-200">
          IMeru Studio
        </h1>

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 focus:border-zinc-600 px-3 py-1.5 rounded-md text-zinc-300 outline-none w-40 transition-colors"
        />

        <button
          onClick={() => saveProject()}
          disabled={isSaving}
          title={saveError ?? undefined}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-all duration-200 outline-none ${
            saveError
              ? "bg-red-500/10 text-red-400 border border-red-500/30"
              : "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300"
          } disabled:opacity-60`}
        >
          <Save className="w-3 h-3" />
          {isSaving ? "Guardando..." : currentProjectId ? "Guardado" : "Guardar"}
        </button>

        <button
          onClick={newProject}
          className="flex items-center gap-2 text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 px-3 py-1.5 rounded-md text-zinc-300 transition-all duration-200 outline-none"
        >
          <FilePlus className="w-3 h-3" />
          Nuevo
        </button>

        {/* CUSTOM SELECT: Mis Proyectos */}
        <div className="relative">
          <button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            onBlur={() => setTimeout(() => setIsProjectsOpen(false), 200)}
            className="flex items-center gap-2 text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 px-3 py-1.5 rounded-md text-zinc-300 transition-all duration-200 outline-none focus:ring-2 focus:ring-zinc-700"
          >
            <FolderOpen className="w-3 h-3 text-zinc-500" />
            Mis Proyectos
            <svg
              className={`w-3 h-3 text-zinc-500 transition-transform duration-300 ease-out ${isProjectsOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`absolute top-full left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl overflow-x-hidden origin-top-left transition-all duration-200 ease-out ${isProjectsOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"}`}
          >
            <div className="flex flex-col py-1">
              {projects.length === 0 ? (
                <span className="px-4 py-2 text-xs text-zinc-500 italic">
                  Todavía no guardaste proyectos.
                </span>
              ) : (
                projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      loadProject(p.id);
                      setIsProjectsOpen(false);
                    }}
                    className={`text-left px-4 py-2 text-xs transition-colors truncate ${
                      p.id === currentProjectId
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {p.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CUSTOM SELECT: Plantillas */}
        <div className="relative">
          <button
            onClick={() => setIsTemplateOpen(!isTemplateOpen)}
            onBlur={() => setTimeout(() => setIsTemplateOpen(false), 200)}
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

          {/* Menú Desplegable Animado */}
          <div
            className={`absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl overflow-hidden origin-top-left transition-all duration-200 ease-out ${isTemplateOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"}`}
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

      {/* LADO DERECHO: Estado, Target, Exportar y Perfil */}
      <div className="flex items-center gap-4">
        {/* Indicador de Sincronización */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mr-2">
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
        <div className="relative border-r border-zinc-800 pr-4">
          <button
            onClick={() => setIsTargetOpen(!isTargetOpen)}
            onBlur={() => setTimeout(() => setIsTargetOpen(false), 200)}
            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 px-2 py-1 transition-colors outline-none"
          >
            Target:{" "}
            <span className="font-medium text-white">
              {CLIENT_LABELS[targetClient]}
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

          {/* Menú Target */}
          <div
            className={`absolute top-full right-4 mt-2 w-44 max-h-80 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl origin-top-right transition-all duration-200 ease-out ${isTargetOpen ? "opacity-100 scale-100 cursor-pointer translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 cursor-pointer invisible"}`}
          >
            <div className="flex flex-col py-1">
              {(Object.entries(CLIENT_LABELS) as [TargetClient, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setTargetClient(id);
                    setIsTargetOpen(false);
                  }}
                  className={`text-left cursor-pointer px-4 py-2 text-xs transition-colors flex items-center justify-between ${targetClient === id ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"}`}
                >
                  {label}
                  {targetClient === id && (
                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón de Exportar */}
        <button
          onClick={exportCode}
          className="group relative cursor-pointer overflow-hidden text-xs font-bold px-4 py-2 rounded bg-zinc-100 text-zinc-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute  inset-0 w-full h-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative">Exportar HTML</span>
        </button>

        {/* PERFIL DE USUARIO */}
        <div className="relative ml-2">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
            className="flex items-center cursor-pointer justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all outline-none border border-zinc-700/50"
          >
            {isAuthLoading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : userEmail ? (
              userEmail.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>

          {/* Menú de Perfil Animado */}
          <div
            className={`absolute top-full right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden origin-top-right transition-all duration-200 ease-out ${isProfileOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"}`}
          >
            {/* Cabecera del menú con el email completo */}
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <p className="text-xs text-zinc-500 font-medium">Logueado como</p>
              <p className="text-sm text-zinc-200 font-semibold truncate mt-0.5">
                {userEmail || "Cargando..."}
              </p>
            </div>

            <div className="flex flex-col py-1.5 p-1.5">
              <Link href={"/settings"}>
                <button className="flex items-center cursor-pointer gap-3 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors w-full text-left">
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
              </Link>

              <div className="h-px bg-zinc-800 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
