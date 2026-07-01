"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { PreConfiguradorCard } from "@/components/pre-configurador-card"

const easing = [0.22, 1, 0.36, 1] as const

export function HeroSection({
  cores,
  coresConsulta,
  aPartirDe,
}: {
  cores: { slug: string; nome: string; hex: string; preco: number | null }[]
  coresConsulta: { slug: string; nome: string; hex: string; preco: number | null }[]
  aPartirDe: number
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-28 pb-0 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easing }}
          className="mb-10 flex items-center gap-3 lg:mb-14"
        >
          <span className="h-px w-8 bg-foreground" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Portas internas · Ferragens inox · Biguaçu — SC · Est. 2022
          </span>
        </motion.div>

        {/* Título + card pré-configurador */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Esquerda: título + imagem preenchendo o espaço abaixo dele */}
          <div className="flex flex-col lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easing, delay: 0.1 }}
              className="text-balance text-4xl font-medium uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl lg:tracking-[-0.03em]"
            >
              Novas portas
              <br />
              se abrem
              <br />
              <span className="text-muted-foreground">para o seu lar.</span>
            </motion.h1>

            {/* Slot de imagem — preenche o vazio e alinha o rodapé com o card.
                Troque public/images/hero-lateral.png pela imagem final. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: easing, delay: 0.5 }}
              className="relative mt-8 hidden min-h-0 flex-1 overflow-hidden border border-border bg-muted lg:block"
            >
              <Image
                src="/images/hero-lateral.png"
                alt="Cena minimalista iluminada com acabamento branco — Brasil Forte"
                fill
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover object-[center_52%]"
              />
            </motion.div>
          </div>

          {/* Direita: card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <PreConfiguradorCard
              cores={cores}
              coresConsulta={coresConsulta}
              aPartirDe={aPartirDe}
            />
          </motion.div>
        </div>

        {/* Descrição + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing, delay: 0.35 }}
          className="mt-10 grid grid-cols-1 gap-8 border-t border-border pt-8 lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            Portas de alto padrão projetadas para resistir à umidade, pragas e maresia.
            Instalação executada por profissionais qualificados em todo litoral de SC.
          </p>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link
              href="#portas"
              className="group inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Ver produtos
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/configurador"
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground underline-offset-4 hover:underline"
            >
              Solicitar orçamento
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Imagem */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: easing, delay: 0.5 }}
        className="relative mx-auto mt-16 max-w-7xl px-6 lg:mt-24 lg:px-10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-b-0 border-border bg-muted sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src="/images/hero-apartamento-minimalista.png"
            alt="Ambiente de apartamento com porta branca em destaque"
            fill
            priority
            sizes="(min-width: 1024px) calc(100vw - 80px), calc(100vw - 48px)"
            className="object-cover"
          />
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
                Revestimento em polímero · Acabamento super branco
              </p>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-background/80 sm:block">
                26°N · BIG/SC
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
