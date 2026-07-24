"use client";

import { motion } from "framer-motion";
import { Check, Zap, Building2, Terminal } from "lucide-react";

const plans = [
  {
    name: "Hacker",
    icon: Terminal,
    price: "0",
    description: "Para desarrolladores solteros probando sus layouts.",
    features: [
      "1,000 auditorías / mes",
      "Motor de renderizado básico",
      "Soporte comunitario",
    ],
    cta: "Empezar gratis",
    popular: false,
    color: "zinc",
  },
  {
    name: "Pro",
    icon: Zap,
    price: "15",
    description: "Para freelancers y agencias que no quieren sorpresas.",
    features: [
      "Auditorías ilimitadas",
      "Linter avanzado para Outlook 2007-19",
      "Inlining mágico de CSS",
      "Soporte prioritario 24/7",
    ],
    cta: "Actualizar a Pro",
    popular: true, // Esto activará el brillo especial
    color: "blue",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Personalizado",
    description: "Infraestructura dedicada para equipos enteros.",
    features: [
      "Todo lo de Pro",
      "Gestión de equipos (RBAC)",
      "API de renderizado (Webhook)",
      "SLA garantizado del 99.9%",
    ],
    cta: "Contactar a Ventas",
    popular: false,
    color: "zinc",
  },
];

export default function PricingSection() {
  return (
    <section className="relative z-20 bg-zinc-950 py-24 px-6 border-t border-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Precios simples. Sin sorpresas.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Elegí el plan que mejor se adapte a tu flujo de trabajo. Desde
            proyectos personales hasta equipos corporativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-zinc-900/80 border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] z-10 scale-100 md:scale-105"
                  : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                  Más Elegido
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${plan.popular ? "bg-blue-500/10 text-blue-400" : "bg-zinc-800 text-zinc-400"}`}
                >
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-zinc-100">
                  {plan.name}
                </h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price === "Personalizado"
                    ? "A medida"
                    : `$${plan.price}`}
                </span>
                {plan.price !== "Personalizado" && (
                  <span className="text-zinc-500 font-mono text-sm">/mes</span>
                )}
              </div>

              <p className="text-zinc-400 text-sm mb-8 font-light min-h-[40px]">
                {plan.description}
              </p>

              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <Check
                        className={`w-5 h-5 shrink-0 ${plan.popular ? "text-blue-400" : "text-zinc-500"}`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
