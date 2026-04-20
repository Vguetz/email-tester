"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bomb, Target, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  // Referencia para medir el scroll de la sección inicial
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // --- MAGIA CINEMÁTICA ---
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Rotación y escala principal de la App
  const appRotateX = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const appScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const appY = useTransform(scrollYProgress, [0, 0.5], [150, 0]);

  // Elementos flotantes pulidos (Parallax Asimétrico)
  const floatLeftY = useTransform(scrollYProgress, [0, 0.6], [300, -50]);
  const floatRightY = useTransform(scrollYProgress, [0, 0.5], [400, 50]);

  const glowScale = useTransform(scrollYProgress, [0, 0.5], [0.3, 1.2]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.15]);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push("/tester");
    }, 500);
  };

  return (
    <motion.div
      animate={
        isExiting
          ? { opacity: 0, scale: 0.95, filter: "blur(10px)" }
          : { opacity: 1 }
      }
      transition={{ duration: 0.5 }}
      className="bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800"
    >
      {/* SECCIÓN 1: EL CINE (Scroll anclado) */}
      <section ref={heroRef} className="relative h-[250vh] w-full bg-zinc-950">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden [perspective:1200px]">
          {/* Fondo de grid sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Brillo dinámico */}
          <motion.div
            style={{ scale: glowScale, opacity: glowOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[50vw] h-[50vw] md:h-[30vw] bg-blue-500 blur-[120px] rounded-full pointer-events-none"
          />

          {/* Texto Principal */}
          <motion.div
            style={{
              opacity: textOpacity,
              y: textY,
              pointerEvents: useTransform(textOpacity, (v) =>
                v > 0 ? "auto" : "none",
              ),
            }}
            className="absolute top-[12%] md:top-[8%] flex flex-col items-center text-center z-20 px-4 md:px-6 w-full"
          >
            <span className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-mono text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/10 mb-4 md:mb-6 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]">
              Presentando IMeru
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-tight">
              Escribí código.
              <br />
              Nosotros lo rompemos.
            </h1>
            <p className="mt-4 md:mt-6 text-zinc-400 text-base md:text-xl font-light max-w-xl px-4">
              Hacé scroll para descubrir el motor de renderizado hostil.
            </p>
          </motion.div>

          {/* WIDGET FLOTANTE IZQUIERDO */}
          <motion.div
            style={{ y: floatLeftY, rotateX: appRotateX }}
            className="hidden lg:flex absolute left-[3%] top-[40%] w-64 bg-[#1e1e1e]/90 backdrop-blur-xl border border-zinc-700/50 rounded-xl p-4 flex-col gap-3 shadow-2xl z-40"
          >
            <div className="text-[10px] font-mono text-zinc-400 border-b border-zinc-800 pb-2 flex justify-between">
              <span>CSS Rules</span>
              <span className="text-blue-400">Inline</span>
            </div>
            <div className="text-xs font-mono text-zinc-300">
              <span className="text-blue-400">.container</span>{" "}
              {"{ padding: 20px; }"}
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full mt-2" />
          </motion.div>

          {/* WIDGET FLOTANTE DERECHO */}
          <motion.div
            style={{ y: floatRightY, rotateX: appRotateX }}
            className="hidden lg:flex absolute right-[3%] top-[30%] w-60 bg-[#1e1e1e]/90 backdrop-blur-xl border border-zinc-700/50 rounded-xl p-4 flex-col gap-3 shadow-2xl z-40"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">
                  Auditoría Pasada
                </span>
              </div>
            </div>
            <div className="text-xs text-zinc-400 font-light leading-relaxed">
              El layout de dos columnas usando tablas es 100% compatible con{" "}
              <span className="text-white">Outlook 2007-2019</span>.
            </div>
          </motion.div>

          {/* LA APP FAKE PRINCIPAL (Responsive Fix) */}
          <motion.div
            style={{
              rotateX: appRotateX,
              scale: appScale,
              y: appY,
              transformStyle: "preserve-3d",
            }}
            className="absolute top-[32%] md:top-[15%] w-[92vw] md:w-[90vw] max-w-6xl h-[60vh] md:h-[75vh] bg-[#1e1e1e] border border-zinc-700/50 rounded-lg shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-30"
          >
            {/* Header de la App */}
            <div className="h-12 md:h-14 w-full bg-[#18181b] border-b border-zinc-800 flex items-center px-3 md:px-6 justify-between">
              <div className="flex items-center gap-3 md:gap-6">
                <span className="text-xs md:text-sm font-semibold text-white tracking-tight truncate">
                  EmailRender Studio
                </span>
                {/* Oculto en móvil */}
                <button className="hidden md:flex items-center gap-2 text-xs bg-zinc-800/50 border border-zinc-700/50 px-3 py-1.5 rounded-md text-zinc-300">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                    />
                  </svg>
                  Plantillas
                </button>
              </div>
              <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                  <span className="hidden sm:inline">Al día</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">Target:</span>{" "}
                  <span className="font-medium text-white">Gmail</span>
                </span>
                {/* Oculto en móvil */}
                <button className="hidden md:block bg-white text-zinc-900 px-3 py-1.5 rounded font-semibold transition-transform hover:scale-105">
                  Exportar
                </button>
              </div>
            </div>

            {/* Cuerpo de la App (Responsive Flex) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#1e1e1e]">
              {/* LADO IZQUIERDO: Editor de Código */}
              <div className="w-full md:w-[55%] h-[40%] md:h-full border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
                {/* Editor CSS Superior (Oculto en móvil para ahorrar espacio) */}
                <div className="hidden md:block h-1/3 w-full border-b border-zinc-800 p-4 overflow-hidden bg-[#1e1e1e]">
                  <div className="flex font-mono text-[11px] leading-relaxed">
                    <div className="text-zinc-600 select-none pr-4 text-right border-r border-zinc-800 mr-4">
                      1<br />2<br />3
                    </div>
                    <div>
                      <span className="text-blue-400">.container</span> {"{ "}
                      <span className="text-blue-300">padding</span>:{" "}
                      <span className="text-orange-300">20px</span>; {"}"}
                    </div>
                  </div>
                </div>

                {/* Editor HTML Inferior */}
                <div className="h-full md:h-2/3 w-full p-2 md:p-4 overflow-hidden bg-[#1e1e1e] relative">
                  <div className="flex font-mono text-[9px] md:text-[11px] leading-relaxed">
                    <div className="text-zinc-600 select-none pr-2 md:pr-4 text-right border-r border-zinc-800 mr-2 md:mr-4">
                      1<br />2<br />3<br />4<br />5<br />6
                    </div>
                    <div className="truncate">
                      <span className="text-zinc-500">{"<"}</span>
                      <span className="text-blue-400">div</span>{" "}
                      <span className="text-blue-300">class</span>=
                      <span className="text-orange-300">"container"</span>
                      <span className="text-zinc-500">{">"}</span>
                      <br />
                      &nbsp;&nbsp;<span className="text-zinc-500">{"<"}</span>
                      <span className="text-blue-400">h1</span>
                      <span className="text-zinc-500">{">"}</span>
                      <span className="text-zinc-300">Hola, Lucas</span>
                      <span className="text-zinc-500">{"</"}</span>
                      <span className="text-blue-400">h1</span>
                      <span className="text-zinc-500">{">"}</span>
                      <br />
                      &nbsp;&nbsp;<span className="text-zinc-500">{"<"}</span>
                      <span className="text-blue-400">p</span>
                      <span className="text-zinc-500">{">"}</span>
                      <span className="text-zinc-300">Layout responsivo</span>
                      <span className="text-zinc-500">{"</"}</span>
                      <span className="text-blue-400">p</span>
                      <span className="text-zinc-500">{">"}</span>
                      <br />
                      <span className="text-zinc-500">{"</"}</span>
                      <span className="text-blue-400">div</span>
                      <span className="text-zinc-500">{">"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LADO DERECHO: Vista Previa Renderizada */}
              <div className="w-full md:w-[45%] h-[60%] md:h-full bg-[#0a0a0a] p-2 md:p-6 flex flex-col items-center">
                <div className="w-full h-full bg-zinc-900 border border-zinc-800 flex flex-col overflow-hidden rounded-sm shadow-2xl">
                  {/* Preview Header */}
                  <div className="h-8 md:h-10 bg-[#000000] border-b border-zinc-800 flex justify-between items-center px-3 md:px-4">
                    <span className="text-[9px] md:text-[11px] text-zinc-500 font-mono">
                      0 Errores
                    </span>
                    <div className="flex gap-2 md:gap-3 text-[8px] md:text-[9px] font-bold text-zinc-500 tracking-wider">
                      <span className="text-white">DESKTOP</span>
                      <span>MOBILE</span>
                    </div>
                  </div>
                  {/* Preview Content (El Canvas Blanco) */}
                  <div className="flex-1 bg-white p-4 md:p-8 text-black font-sans overflow-hidden">
                    <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 tracking-tight">
                      Hola, Lucas
                    </h1>
                    <p className="text-xs md:text-sm mb-4 md:mb-6 text-zinc-800">
                      Este es un layout minimalista de dos columnas.
                    </p>

                    {/* Simulación de las Tablas */}
                    <div className="flex flex-col md:flex-row w-full gap-2 mt-2">
                      <div className="w-full md:w-1/2 bg-[#f4f4f4] border border-[#ddd] p-2 md:p-3 text-xs md:text-sm text-zinc-700">
                        Columna 1
                      </div>
                      <div className="w-full md:w-1/2 bg-[#f4f4f4] border border-[#ddd] p-2 md:p-3 text-xs md:text-sm text-zinc-700">
                        Columna 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 2: EL CONTENIDO */}
      <section className="relative z-20 bg-zinc-950 pt-20 pb-24 px-6 border-t border-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
              El problema no sos vos.
            </h2>
            <p className="text-zinc-400 text-base md:text-xl font-light max-w-2xl mx-auto">
              Te pasás horas armando un layout moderno, y el cliente corporativo
              lo abre en un motor de Word de hace 15 años. Se acabó la sorpresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Motor Destructivo",
                icon: Bomb,
                color: "text-red-400 group-hover:text-red-300",
                desc: "Mutilamos tu código en vivo eliminando propiedades modernas para simular entornos hostiles.",
              },
              {
                title: "Linter Preciso",
                icon: Target,
                color: "text-yellow-400 group-hover:text-yellow-300",
                desc: "Si usás una etiqueta o estilo que Outlook o Gmail no soportan, te lo marcamos en la cara.",
              },
              {
                title: "Inlining Mágico",
                icon: Sparkles,
                color: "text-blue-400 group-hover:text-blue-300",
                desc: "Escribí CSS limpio. Nosotros lo convertimos en estilos en línea, listo para producción.",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group bg-zinc-900/30 border border-zinc-800/50 p-6 md:p-8 rounded-3xl hover:bg-zinc-900/80 transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-4 md:mb-6 inline-block"
                >
                  <feat.icon
                    className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${feat.color}`}
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-zinc-100">
                  {feat.title}
                </h3>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CTA FINAL */}
      <section className="relative z-20 py-24 md:py-40 px-6 text-center border-t border-zinc-900 bg-zinc-950 overflow-hidden">
        {/* Luz ambiental sutil en el footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

        <h2 className="text-4xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tight relative z-10">
          Entrá al Studio.
        </h2>
        <button
          onClick={handleStartClick}
          className="group relative px-8 md:px-10 py-4 md:py-5 bg-white text-zinc-950 font-bold text-base md:text-lg rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 z-10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Comenzar ahora
            <svg
              className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
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
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </section>

      <footer className="relative z-20 py-6 md:py-8 text-center text-xs text-zinc-600 font-mono bg-zinc-950 border-t border-zinc-900/50">
        Created By Lucas Gomez.
      </footer>
    </motion.div>
  );
}
