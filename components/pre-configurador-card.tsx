"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"
import { formatBRL, type TipoPorta } from "@/lib/catalogo"

type Cor = { slug: string; nome: string; hex: string; preco: number | null }

const TIPOS: { id: TipoPorta; nome: string }[] = [
  { id: "giro", nome: "Giro" },
  { id: "correr", nome: "Correr" },
]

/**
 * Mini "pré-configurador" no hero. Deixa o cliente escolher tipo + cor e leva
 * direto pro /configurador já com as escolhas pré-selecionadas (via query).
 */
export function PreConfiguradorCard({
  cores,
  coresConsulta,
  aPartirDe,
}: {
  cores: Cor[]
  coresConsulta: Cor[]
  aPartirDe: number
}) {
  const [tipo, setTipo] = useState<TipoPorta>("giro")
  // Nenhuma cor pré-selecionada: o "a partir de" genérico não deve ficar preso a
  // um modelo específico. Ao escolher uma cor, o preço passa a ser o dela.
  const [corSlug, setCorSlug] = useState<string>("")

  const href = `/configurador?tipo=${tipo}${corSlug ? `&cor=${corSlug}` : ""}`
  const corSel = [...cores, ...coresConsulta].find((c) => c.slug === corSlug)
  const corNome = corSel?.nome
  // Cor escolhida → preço dela (null = sob consulta); nada escolhido → mínimo geral.
  const precoSel: number | null = corSel ? corSel.preco : aPartirDe

  return (
    <div className="border border-border bg-background p-6 lg:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Configurador online
      </p>
      <p className="mt-2 text-xl font-medium uppercase tracking-[-0.01em]">
        Monte sua porta
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha, veja o pré-orçamento na hora e finalize no WhatsApp.
      </p>

      {/* Tipo */}
      <p className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Tipo de porta
      </p>
      <div className="flex gap-2">
        {TIPOS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTipo(t.id)}
            className={`flex-1 border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
              tipo === t.id
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/40"
            }`}
          >
            {t.nome}
          </button>
        ))}
      </div>

      {/* Cor */}
      <p className="mb-2 mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>Cor</span>
        {corNome && <span className="text-foreground">{corNome}</span>}
      </p>
      <div className="flex gap-2">
        {cores.map((c) => {
          const sel = corSlug === c.slug
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCorSlug(c.slug)}
              title={c.nome}
              aria-label={c.nome}
              className={`relative aspect-square flex-1 border transition-all ${
                sel
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-foreground/40"
              }`}
              style={{ background: c.hex }}
            >
              {sel && (
                <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center bg-foreground text-background">
                  <Check className="size-2.5" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Demais cores (sob consulta) — uma fileira preenchendo toda a largura */}
      {coresConsulta.length > 0 && (
        <div className="mt-2 grid grid-cols-10 gap-1.5">
          {coresConsulta.map((c) => {
            const sel = corSlug === c.slug
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCorSlug(c.slug)}
                title={c.nome}
                aria-label={c.nome}
                className={`aspect-square border transition-all ${
                  sel
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
                style={{ background: c.hex }}
              />
            )
          })}
        </div>
      )}

      {/* Preço + CTA */}
      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {precoSel === null ? "Preço" : "A partir de"}
          </span>
          {precoSel === null ? (
            <span className="text-sm font-medium uppercase tracking-[-0.01em]">
              Sob consulta
            </span>
          ) : (
            <span className="text-lg tabular-nums">{formatBRL(precoSel)}</span>
          )}
        </div>
        <Link
          href={href}
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
        >
          Montar minha porta
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  )
}
