"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

export default function Home() {
  const router = useRouter();
  // NUEVO: Estado para controlar cuándo el usuario hace clic en "Empezar"
  const [isExiting, setIsExiting] = useState(false);

  // NUEVO: Función que intercepta el clic
  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitamos que haga algo por defecto
    setIsExiting(true); // Disparamos la animación de salida

    // Esperamos 600ms (lo que dura la animación) y forzamos el cambio de ruta
    setTimeout(() => {
      router.push("/tester");
    }, 600);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
    // NUEVO: La variante de salida.
    // Aplicamos un desenfoque y un pequeño scale-down para dar profundidad
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        staggerDirection: -1, // Hace que los elementos desaparezcan de abajo hacia arriba
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    // NUEVO: Que los textos se vayan hacia arriba al salir
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden selection:bg-zinc-800">
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-150 h-100 bg-zinc-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* NUEVO: Cambiamos animate="show" por un condicional. 
        Si isExiting es true, pasa a la variante "exit". 
      */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={isExiting ? "exit" : "show"}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono text-zinc-400 border border-zinc-800 rounded-full bg-zinc-900/50 backdrop-blur-sm">
            EmailRender Studio v1.0
          </span>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-100 mb-6">
            Escribe correos. <br />
            <span className="text-zinc-500">Renderiza sin miedo.</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            El primer entorno de desarrollo minimalista que te muestra en tiempo
            real cómo Outlook y Gmail van a destruir tu código, para que puedas
            evitarlo.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {/* NUEVO: Reemplazamos el <Link> directo por un <button> que llama a nuestra función */}
          <div className="group relative inline-flex items-center gap-2">
            <div className="absolute -inset-1 bg-white/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.button
              onClick={handleStartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
            >
              Empezar ahora
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer minimalista: Le agregamos una variante para que desaparezca junto con el resto */}
      <motion.div
        animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={isExiting ? { duration: 0.3 } : { delay: 1.5, duration: 1 }}
        className="absolute bottom-8 text-xs text-zinc-600 font-mono"
      >
        Created By{" "}
        <Link
          href="https://linkedin.com/in/lucasgomezapp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-300 underline"
        >
          Lucas Gomez
        </Link>
        .
      </motion.div>
    </div>
  );
}
