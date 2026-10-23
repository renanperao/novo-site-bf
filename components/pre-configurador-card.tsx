"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { formatBRL, type TipoPorta } from "@/lib/catalogo"

// Cores principais trazem a foto da porta (giro e correr) e o preço "a partir de" de cada tipo.
export type CorPrincipal = {
  slug: string
  nome: string
  foto: string | null
  fotoCorrer: string | null
  preco: number
  precoCorrer: number
}

const TIPOS: { id: TipoPorta; nome: string }[] = [
  { id: "giro", nome: "Giro" },
  { id: "correr", nome: "Correr" },
]

/**
 * Mini "pré-configurador" no hero: tipo + uma das cores principais, e leva pro
 * /configurador já com as escolhas (via query). Começa no mais vendido marcado,
 * então o preço aparece de cara. As demais cores ficam no configurador.
 */
export function PreConfiguradorCard({
  cores,
  maisCores,
  inicial,
}: {
  cores: CorPrincipal[]
  maisCores: number
  inicial: string
}) {
  const [tipo, setTipo] = useState<TipoPorta>("giro")
  const [corSlug, setCorSlug] = useState(inicial)
  const cor = cores.find((c) => c.slug === corSlug) ?? cores[0]
  const precoDe = (c: CorPrincipal) => (tipo === "correr" ? c.precoCorrer : c.preco)

  return (
    <div className="flex h-full flex-col border border-border bg-background p-5 lg:p-7">
      <p className="text-xl font-medium uppercase tracking-[-0.01em]">Monte sua porta</p>

      <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Tipo de porta">
        {TIPOS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={tipo === t.id}
            onClick={() => setTipo(t.id)}
            className={`flex-1 border px-3 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
              tipo === t.id
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/40"
            }`}
          >
            Porta de {t.nome}
          </button>
        ))}
      </div>

      {/* Cores principais: foto real da porta + nome + preço */}
      <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Cor">
        {cores.map((c) => {
          const sel = cor?.slug === c.slug
          const foto = (tipo === "correr" && c.fotoCorrer) || c.foto
          return (
            <button
              key={c.slug}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => setCorSlug(c.slug)}
              className={`relative flex flex-col border text-left transition-all ${
                sel ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/40"
              }`}
            >
              <span className="relative block aspect-[3/4] bg-[#E9E8E4]">
                {foto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={foto}
                    alt={`Porta ${c.nome}`}
                    className="absolute inset-0 h-full w-full object-contain p-2 mix-blend-multiply"
                  />
                )}
              </span>
              <span className="flex flex-col gap-0.5 p-2">
                <span className="text-[12px] font-medium leading-tight">{c.nome}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {formatBRL(precoDe(c))}
                </span>
              </span>
              {sel && (
                <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center bg-foreground text-background">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {maisCores > 0 && (
        <Link
          href={`/configurador?tipo=${tipo}`}
          className="mt-3 inline-flex items-center gap-1.5 self-start text-[13px] underline underline-offset-4 hover:text-muted-foreground"
        >
          Ver mais {maisCores} cores e madeiras
          <ArrowRight className="size-3.5" />
        </Link>
      )}

      <div className="mt-auto pt-5">
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">a partir de</span>
          {cor && <span className="text-2xl font-medium tabular-nums">{formatBRL(precoDe(cor))}</span>}
        </div>
        <Link
          href={`/configurador?tipo=${tipo}&cor=${cor?.slug ?? ""}`}
          className="group mt-3 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-background transition-colors hover:bg-background hover:text-foreground"
        >
          Montar minha porta
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <p className="mt-2.5 text-center text-xs text-muted-foreground">
          Kit completo com batente, vistas e fechadura
        </p>
      </div>
    </div>
  )
}
