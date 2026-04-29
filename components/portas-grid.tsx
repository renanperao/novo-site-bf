"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const easing = [0.22, 1, 0.36, 1] as const

const portas = [
  {
    id: "001",
    name: "PET DIAMANTE",
    type: "Pivotante",
    material: "MDF Ultra · DISPONÍVEL A PRONTA ENTREGA",
    image: "/images/pet-diamante.png",
  },
  {
    id: "002",
    name: "MADEIRA TAUARI",
    type: "Embutida",
    material: "Madeira Maciça · DISPONÍVEL A PRONTA ENTREGA",
    image: "/images/madeira-tauari.png",
  },
  {
    id: "003",
    name: "UV GELO",
    type: "Vidro & Madeira",
    material: "Freixo escurecido",
    image: "/images/uv-gelo.png",
  },
]

export function PortasGrid() {
  return (
    <section id="portas" className="border-b border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">02 /</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Coleção</span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl">
              Portas que pertencem
              <br />
              <span className="text-muted-foreground">ao projeto.</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-px border-x border-b border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {portas.map((porta, index) => (
            <motion.article
              key={porta.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: easing, delay: index * 0.08 }}
              className="group relative flex flex-col bg-background"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={porta.image || "/placeholder.svg"}
                  alt={`Porta ${porta.name} — ${porta.material}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background/90">
                  <span className="inline-block h-1.5 w-1.5 bg-background" aria-hidden />
                  BFP — {porta.id}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 border-t border-border p-6 lg:p-8">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">{porta.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {porta.type} · {porta.material}
                  </p>
                </div>
                <Link
                  href="#contato"
                  aria-label={`Solicitar especificação ${porta.name}`}
                  className="inline-flex size-9 items-center justify-center border border-border text-foreground transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
