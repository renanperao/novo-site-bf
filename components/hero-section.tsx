"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const easing = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        {/* Meta column */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-foreground" aria-hidden />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Desde 2022
              </span>
            </div>

            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <p>Portas internas</p>
              <p>Ferragens 100% inox</p>
              <p>Biguaçu — SC</p>
            </div>
          </motion.div>
        </div>

        {/* Headline column */}
        <div className="lg:col-span-9">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easing, delay: 0.1 }}
            className="text-balance text-4xl font-medium uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[5.5rem] lg:tracking-[-0.03em]"
          >
            Novas portas
            <br />
            se abrem
            <br />
            <span className="text-muted-foreground">para o seu lar.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.35 }}
            className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Portas de alto padrão projetadas para resistir à umidade, pragas e maresia. Instalação executada por
              profissionais qualificados em todo litoral de SC.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#portas"
                className="group inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Ver produtos
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#atelie"
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground underline-offset-4 hover:underline"
              >
                Personalizar
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: easing, delay: 0.5 }}
        className="relative mx-auto mt-20 max-w-7xl px-6 lg:mt-28 lg:px-10"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-muted">
          <Image
            src="/images/branca-apartamento.png"
            alt="Ambiente de apartamento com porta branca em destaque"
            fill
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />

          {/* Technical overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background/80">
                <span className="inline-block h-1.5 w-1.5 bg-background" aria-hidden />
                BFP — 001
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/80">
                Detalhe / Inox 304
              </div>
            </div>
            <div className="flex items-end justify-between gap-6">
              <p className="max-w-xs text-[11px] uppercase tracking-[0.2em] text-background/90">
                Madeira maciça • Acabamento natural
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/80">26°N · BIG/SC</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
