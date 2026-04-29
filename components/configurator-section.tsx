"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const easing = [0.22, 1, 0.36, 1] as const

type Option = {
  id: string
  label: string
  caption: string
  texture: string
}

const woods: Option[] = [
  { id: "walnut", label: "NOGUEIRA", caption: "Escura", texture: "/images/texture-walnut.jpg" },
  { id: "oak", label: "CARVALHO", caption: "Mel", texture: "/images/texture-oak.jpg" },
  { id: "ash", label: "FREIXO", caption: "Grafite", texture: "/images/texture-ash.jpg" },
]

const hardware: Option[] = [
  { id: "inox", label: "INOX 304", caption: "Escovado", texture: "/images/texture-inox.jpg" },
  { id: "black", label: "MATTE", caption: "Preto fosco", texture: "/images/texture-black.jpg" },
]

const formats = [
  { id: "pivot", label: "PIVOT", caption: "Pivotante" },
  { id: "flush", label: "FLUSH", caption: "Embutida" },
  { id: "double", label: "DOUBLE", caption: "Duas folhas" },
]

const heights = [
  { id: "h210", label: "210", caption: "cm" },
  { id: "h240", label: "240", caption: "cm" },
  { id: "h280", label: "280", caption: "cm" },
]

export function ConfiguratorSection() {
  const [wood, setWood] = useState(woods[0].id)
  const [hw, setHw] = useState(hardware[0].id)
  const [format, setFormat] = useState(formats[0].id)
  const [height, setHeight] = useState(heights[1].id)

  const summary = useMemo(() => {
    const w = woods.find((x) => x.id === wood)?.label
    const h = hardware.find((x) => x.id === hw)?.label
    const f = formats.find((x) => x.id === format)?.label
    const ht = heights.find((x) => x.id === height)?.label
    return `${f} · ${w} · ${h} · ${ht}cm`
  }, [wood, hw, format, height])

  return (
    <section id="atelie" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-32">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">04 /</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Ateliê</span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl">
              Configure
              <br />
              <span className="text-muted-foreground">a sua porta.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Split screen */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-5">
        {/* Showcase — 60% (3/5) */}
        <div className="relative border-x border-b border-border bg-muted lg:col-span-3 lg:border-b-0">
          <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-[760px]">
            <Image
              src="/images/configurator-door.jpg"
              alt="Showcase da porta configurada"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />

            {/* Technical overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 lg:p-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background/85">
                  <span className="inline-block h-1.5 w-1.5 bg-background" aria-hidden />
                  CONFIG / LIVE
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/85">
                  REV — {wood}.{hw}.{format}
                </div>
              </div>

              <motion.div
                key={summary}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easing }}
                className="flex items-end justify-between gap-6"
              >
                <p className="max-w-md text-balance text-base font-medium uppercase tracking-[0.12em] text-background lg:text-lg">
                  {summary}
                </p>
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-background/85 sm:block">
                  Pré-visualização
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Options panel — 40% (2/5) */}
        <div className="border-x border-b border-border bg-background lg:col-span-2 lg:border-l-0">
          <div className="flex flex-col">
            <TilesGroup
              index="A"
              title="Madeira"
              items={woods}
              selected={wood}
              onSelect={setWood}
              cols={3}
            />
            <TilesGroup
              index="B"
              title="Ferragem"
              items={hardware}
              selected={hw}
              onSelect={setHw}
              cols={2}
            />
            <PlainTilesGroup
              index="C"
              title="Formato"
              items={formats}
              selected={format}
              onSelect={setFormat}
            />
            <PlainTilesGroup index="D" title="Altura" items={heights} selected={height} onSelect={setHeight} />

            <div className="flex flex-col gap-4 p-6 lg:p-8">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Resumo</span>
                <span>BFP — CFG</span>
              </div>
              <p className="text-balance text-sm font-medium uppercase tracking-[0.14em] text-foreground">
                {summary}
              </p>
              <a
                href="#contato"
                className="mt-2 inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Solicitar orçamento técnico
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TilesGroup({
  index,
  title,
  items,
  selected,
  onSelect,
  cols,
}: {
  index: string
  title: string
  items: Option[]
  selected: string
  onSelect: (id: string) => void
  cols: 2 | 3
}) {
  return (
    <div className="border-b border-border p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>
          {index} · {title}
        </span>
        <span>{items.length} opções</span>
      </div>
      <div className={cn("grid gap-3", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {items.map((item) => {
          const isActive = selected === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex flex-col overflow-hidden border text-left transition-colors",
                isActive ? "border-foreground" : "border-border hover:border-foreground/60",
              )}
              aria-pressed={isActive}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image
                  src={item.texture || "/placeholder.svg"}
                  alt={item.label}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {isActive && (
                  <span className="absolute right-2 top-2 inline-flex size-5 items-center justify-center bg-foreground text-background">
                    <Check className="size-3" />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 px-3 py-2.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground">
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.caption}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PlainTilesGroup({
  index,
  title,
  items,
  selected,
  onSelect,
}: {
  index: string
  title: string
  items: { id: string; label: string; caption: string }[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="border-b border-border p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>
          {index} · {title}
        </span>
        <span>{items.length} opções</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const isActive = selected === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={isActive}
              className={cn(
                "flex aspect-square flex-col items-start justify-between border p-3 text-left transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/60",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.2em]",
                  isActive ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {item.caption}
              </span>
              <span className="text-base font-medium uppercase tracking-[0.04em]">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
