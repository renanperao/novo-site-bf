"use client"

import { motion } from "framer-motion"

const easing = [0.22, 1, 0.36, 1] as const

const steps = [
  {
    number: "01",
    title: "ESPECIFICAÇÃO",
    description:
      "Reuniões técnicas com o responsável. Levantamento de medidas, materiais e ferragens para definição completa do projeto.",
  },
  {
    number: "02",
    title: "FABRICAÇÃO",
    description:
      "Produtos selecionados e processados em fábricas especializadas em portas. Controle de umidade, acabamento manual e ferragens em aço inox.",
  },
  {
    number: "03",
    title: "INSTALAÇÃO PROFISSIONAL",
    description:
      "Instalação técnica executada por mão de obra qualificada, com ajuste fino de batente, vedação e regulagem de ferragens.",
  },
]

export function ProcessSection() {
  return (
    <section id="processo" className="scroll-mt-16 border-b border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">03 /</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Processo</span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl">
              Da medida à instalação final
            </h2>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-px border-x border-b border-border bg-border lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: easing, delay: index * 0.1 }}
              className="relative flex min-h-[320px] flex-col bg-background p-8 lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {step.number}
                </span>
                <span className="h-px w-12 bg-foreground" aria-hidden />
              </div>

              <div className="mt-14 flex flex-col gap-4">
                <h3 className="text-balance text-xl font-medium uppercase leading-[1.05] tracking-[0.02em] text-foreground lg:text-2xl">
                  {step.title}
                </h3>
                <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easing, delay: 0.4 }}
          className="mt-12 flex flex-col gap-4 border-t border-border pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Atendimento técnico — Grande Florianópolis e Vale do Itajaí.</span>
          <span>Prazo médio de 1 a 2 dias</span>
        </motion.div>
      </div>
    </section>
  )
}
