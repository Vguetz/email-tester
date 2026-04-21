"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  Settings,
  ArrowLeft,
  Zap,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_USER = {
  name: "Lucas Gomez",
  email: "lucas@ejemplo.com",
  plan: "Hacker Tier (Free)",
  avatarText: "LG",
};

const MOCK_USAGE = {
  auditsUsed: 842,
  auditsLimit: 1000,
  resetDate: "1 de Mayo, 2026",
};

type TabId = "account" | "usage" | "preferences";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("usage");

  // Cálculo para la barra de progreso
  const usagePercentage =
    (MOCK_USAGE.auditsUsed / MOCK_USAGE.auditsLimit) * 100;
  const isNearLimit = usagePercentage > 80;

  const tabs = [
    { id: "account", label: "Cuenta", icon: User },
    { id: "usage", label: "Consumo y Plan", icon: CreditCard },
    { id: "preferences", label: "Preferencias", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
      {/* Fondo de grid sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Brillo superior */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Cabecera y Botón de Volver */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <button
              onClick={() => router.push("/tester")}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al Studio
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Configuración
            </h1>
            <p className="text-zinc-400 mt-2 font-light">
              Administrá tu cuenta, límites de uso y preferencias del editor.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-2 pr-4 rounded-full backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold shadow-lg">
              {MOCK_USER.avatarText}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">
                {MOCK_USER.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {MOCK_USER.plan}
              </span>
            </div>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL: Sidebar + Contenido */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* SIDEBAR DE NAVEGACIÓN */}
          <nav className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full whitespace-nowrap md:whitespace-normal text-left ${
                  activeTab === tab.id
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-zinc-800/80 border border-zinc-700/50 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon
                  className={`w-4 h-4 ${activeTab === tab.id ? "text-blue-400" : ""}`}
                />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ÁREA DE CONTENIDO */}
          <div className="flex-1 w-full min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* --- TAB: CONSUMO Y PLAN (SaaS Focus) --- */}
                {activeTab === "usage" && (
                  <>
                    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                            Límites de Auditoría
                            {isNearLimit && (
                              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                Cerca del límite
                              </span>
                            )}
                          </h2>
                          <p className="text-sm text-zinc-400 font-light">
                            Medimos cada vez que compilás tu código contra las
                            reglas de los clientes de correo.
                          </p>
                        </div>
                        <Zap
                          className={`w-8 h-8 ${isNearLimit ? "text-orange-400" : "text-blue-400"}`}
                        />
                      </div>

                      {/* Barra de Progreso */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-zinc-300">
                            {MOCK_USAGE.auditsUsed} usadas
                          </span>
                          <span className="text-zinc-500">
                            {MOCK_USAGE.auditsLimit} total
                          </span>
                        </div>
                        <div className="w-full h-3 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isNearLimit ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-600 to-indigo-500"}`}
                          />
                        </div>
                        <p className="text-xs text-zinc-500">
                          Tu ciclo de facturación se reinicia el{" "}
                          <span className="text-zinc-300">
                            {MOCK_USAGE.resetDate}
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600/10 to-indigo-900/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32 text-blue-500" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 relative z-10 text-blue-100">
                        Pasate a IMeru Pro
                      </h2>
                      <p className="text-sm text-blue-200/60 font-light max-w-md mb-6 relative z-10">
                        Desbloqueá auditorías ilimitadas, inlining de CSS
                        avanzado y exportación directa a plataformas de envío.
                      </p>
                      <ul className="space-y-2 mb-8 relative z-10">
                        {[
                          "Auditorías infinitas",
                          "Prioridad en el motor de renderizado",
                          "Soporte para componentes de React Email",
                        ].map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-blue-100/80"
                          >
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />{" "}
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="relative z-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                        Actualizar Plan ($15/mes)
                      </button>
                    </div>
                  </>
                )}

                {/* --- TAB: CUENTA --- */}
                {activeTab === "account" && (
                  <>
                    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                      <h2 className="text-xl font-semibold mb-6">
                        Datos Personales
                      </h2>
                      <div className="space-y-5 max-w-md">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block font-mono">
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            defaultValue={MOCK_USER.name}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors text-zinc-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block font-mono">
                            Email (Solo lectura)
                          </label>
                          <input
                            type="email"
                            readOnly
                            defaultValue={MOCK_USER.email}
                            className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                          />
                        </div>
                        <button className="bg-zinc-100 text-zinc-900 font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-white transition-colors">
                          Guardar Cambios
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-8 backdrop-blur-xl">
                      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-red-400">
                        <ShieldAlert className="w-5 h-5" /> Zona de Peligro
                      </h2>
                      <p className="text-sm text-red-200/60 font-light mb-6">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por
                        favor, estate seguro.
                      </p>
                      <button className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all">
                        Eliminar mi cuenta
                      </button>
                    </div>
                  </>
                )}

                {/* --- TAB: PREFERENCIAS --- */}
                {activeTab === "preferences" && (
                  <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-semibold mb-6">
                      Entorno de Desarrollo
                    </h2>

                    <div className="space-y-8">
                      {/* Toggle Option 1 */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-200">
                            Autoguardado de Plantillas
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1">
                            Guarda tu código automáticamente en el LocalStorage
                            cada 5 segundos.
                          </p>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>

                      <div className="h-px w-full bg-zinc-800/50" />

                      {/* Select Option */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-200">
                            Cliente de correo por defecto
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1">
                            El target client que se selecciona al abrir un nuevo
                            proyecto.
                          </p>
                        </div>
                        <select className="bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-zinc-600">
                          <option>Outlook 2007-19</option>
                          <option>Gmail Web</option>
                          <option>Apple Mail</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
