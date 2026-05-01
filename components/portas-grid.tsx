"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const easing = [0.22, 1, 0.36, 1] as const

type PortaOptions = {
  larguras: string[]
  alturas: string[]
  espessuras: string[]
  fechaduras: string[]
}

type Porta = {
  id: string
  name: string
  type: string
  material: string
  badge?: string
  image: string
  options: PortaOptions
}

const portas: Porta[] = [
  {
    id: "001",
    name: "PET DIAMANTE",
    type: "Pivotante",
    material: "MDF Ultra",
    badge: "Pronta entrega",
    image: "/images/pet-diamante.png",
    options: {
      larguras: ["80", "90", "100"],
      alturas: ["210", "240", "260", "280"],
      espessuras: ["9", "11", "14"],
      fechaduras: ["Magnética", "Rolete", "Multiponto"],
    },
  },
  {
    id: "002",
    name: "MADEIRA TAUARI",
    type: "Embutida",
    material: "Madeira Maciça",
    badge: "Pronta entrega",
    image: "/images/madeira-tauari.png",
    options: {
      larguras: ["70", "80", "90", "100"],
      alturas: ["210", "240", "280"],
      espessuras: ["9", "11"],
      fechaduras: ["Magnética", "Multiponto"],
    },
  },
  {
    id: "003",
    name: "UV GELO",
    type: "Vidro & Madeira",
    material: "Freixo escurecido",
    image: "/images/uv-gelo.png",
    options: {
      larguras: ["80", "90", "100"],
      alturas: ["210", "240", "280"],
      espessuras: ["11", "14"],
      fechaduras: ["Magnética", "Rolete"],
    },
  },
]

function OptionGroup({
  label,
  items,
  selected,
  onSelect,
  suffix = "",
}: {
  label: string
  items: string[]
  selected: string
  onSelect: (v: string) => void
  suffix?: string
}) {
  return (
    <div className="border-b border-border p-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label} · {items.length} {items.length === 1 ? "opção" : "opções"}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={active}
              className={cn(
                "border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/60",
              )}
            >
              {item}
              {suffix}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProductConfigurator({ porta }: { porta: Porta }) {
  const [largura, setLargura] = useState(
    porta.options.larguras[1] ?? porta.options.larguras[0],
  )
  const [altura, setAltura] = useState(
    porta.options.alturas[1] ?? porta.options.alturas[0],
  )
  const [espessura, setEspessura] = useState(porta.options.espessuras[0])
  const [fechadura, setFechadura] = useState(porta.options.fechaduras[0])

  const summary = `${largura}×${altura}cm · Bat. ${espessura}cm · ${fechadura}`

  return (
    <div className="grid grid-cols-1 overflow-hidden sm:grid-cols-2">
      {/* Imagem do produto */}
      <div className="relative hidden bg-muted sm:block" style={{ minHeight: 480 }}>
        <Image
          src={porta.image || "/placeholder.svg"}
          alt={porta.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 flex items-end p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background/85">
            <span className="inline-block h-1.5 w-1.5 bg-background" aria-hidden />
            BFP — {porta.id}
          </div>
        </div>
      </div>

      {/* Painel de opções */}
      <div className="flex max-h-[85vh] flex-col overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              BFP — {porta.id}
            </p>
            <h2 className="text-base font-medium uppercase tracking-[0.12em] text-foreground">
              {porta.name}
            </h2>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {porta.type} · {porta.material}
            </p>
          </div>
          <DialogClose className="inline-flex size-8 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
            <X className="size-3.5" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </div>

        <OptionGroup
          label="Largura"
          items={porta.options.larguras}
          selected={largura}
          onSelect={setLargura}
          suffix="cm"
        />
        <OptionGroup
          label="Altura"
          items={porta.options.alturas}
          selected={altura}
          onSelect={setAltura}
          suffix="cm"
        />
        <OptionGroup
          label="Espessura do batente"
          items={porta.options.espessuras}
          selected={espessura}
          onSelect={setEspessura}
          suffix="cm"
        />
        <OptionGroup
          label="Tipo de fechadura"
          items={porta.options.fechaduras}
          selected={fechadura}
          onSelect={setFechadura}
        />

        {/* Resumo + CTA */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Resumo</span>
            <span>BFP — CFG</span>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
            {summary}
          </p>
          <DialogClose asChild>
            <a
              href="#contato"
              className="mt-1 inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Solicitar orçamento técnico
            </a>
          </DialogClose>
        </div>
      </div>
    </div>
  )
}

export function PortasGrid() {
  return (
    <section id="portas" className="scroll-mt-16 border-b border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Cabeçalho */}
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-8 lg:grid-cols-12 lg:gap-16 lg:pb-10">
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
              {/* Imagem */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted lg:aspect-auto lg:h-72">
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
                {porta.badge && (
                  <div className="absolute bottom-4 left-4 border border-background/30 bg-background/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-background/90 backdrop-blur-sm">
                    {porta.badge}
                  </div>
                )}
              </div>

              {/* Info + CTA */}
              <div className="flex items-center justify-between gap-4 border-t border-border p-6 lg:p-8">
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                    {porta.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {porta.type} · {porta.material}
                  </p>
                </div>

              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
