"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (view === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("¡Checkea tu email para confirmar el registro!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error("Error al iniciar sesión:", error);
          throw error;
        }

        router.refresh();
        router.push("/tester");
      }
    } catch (error: any) {
      setMessage(error.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  // Variantes para la animación de intercambio de vistas (Fade y Slide sutil)
  const fadeVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo de grid cinematográfico */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Brillo ambiental dinámico: Cambia de color según la vista */}
      <motion.div
        animate={{
          backgroundColor:
            view === "login"
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(168, 85, 247, 0.1)",
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
      >
        {/* Cabecera Animada */}
        <div className="mb-10 text-center h-24 flex flex-col justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700/50 shadow-inner">
                {view === "login" ? (
                  <LogIn className="w-5 h-5 text-blue-400" />
                ) : (
                  <UserPlus className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-white">
                {view === "login" ? "IMeru Studio" : "Unite a IMeru"}
              </h1>
              <p className="text-zinc-500 text-sm mt-2 font-light">
                {view === "login"
                  ? "Ingresá para auditar tus correos."
                  : "La herramienta definitiva para devs de email."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <motion.div layout className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1 font-mono">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700 text-zinc-200"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div layout className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1 font-mono">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700 text-zinc-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.button
            layout
            disabled={isLoading}
            className="w-full bg-white  cursor-pointer text-zinc-950 font-bold py-4 rounded-2xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-80 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                <span className="text-zinc-500">Procesando...</span>
              </>
            ) : (
              <>
                {view === "login" ? "Entrar" : "Crear Cuenta"}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden"
            >
              <p className="mt-4 text-xs text-center text-zinc-300 bg-zinc-800/50 py-3 rounded-xl border border-zinc-700/50">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="mt-8 text-center border-t border-zinc-800/50 pt-6"
        >
          <button
            type="button"
            onClick={() => {
              setView(view === "login" ? "register" : "login");
              setMessage("");
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors relative group"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={view}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="block cursor-pointer"
              >
                {view === "login"
                  ? "¿No tenés cuenta? Registrate gratis"
                  : "¿Ya tenés cuenta? Iniciá sesión"}
              </motion.span>
            </AnimatePresence>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-zinc-400 transition-all group-hover:w-full" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
