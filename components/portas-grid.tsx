"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react"
import { formatBRL } from "@/lib/catalogo"
import type { Modelo } from "@/lib/catalogo"
import { KIT_ITENS, PAGAMENTO } from "@/lib/conteudo"
import { waLink } from "@/lib/whatsapp"

/** "11 a 14", "21 a 24" → "11–24" (menor início, maior fim). */
function faixa(valores: number[]) {
  return valores.length ? `${Math.min(...valores)}–${Math.max(...valores)}` : null
}

function faixaBatente(batentes: string[]) {
  return faixa(batentes.flatMap((b) => (b.match(/\d+/g) ?? []).map(Number)))
}

export function PortasGrid({ modelos }: { modelos: Modelo[] }) {
  // Só as brancas (preço direto) aparecem de início; as sob consulta (madeiras)
  // entram no "ver mais".
  const [verMais, setVerMais] = useState(false)
  const extras = modelos.filter((m) => !m.disponivel).length
  const visiveis = verMais ? modelos : modelos.filter((m) => m.disponivel)

  return (
    <section id="portas" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mb-8 lg:mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Modelos
          </p>
          <h2 className="mt-3 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-foreground sm:text-5xl">
            Kit porta pronta branca
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Todo kit vem com: <span className="text-foreground">{KIT_ITENS.join(" · ")}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((m) => {
            const batente = faixaBatente(m.batentes)
            return (
              <article
                key={m.slug}
                className="relative grid grid-cols-[38%_1fr] bg-background md:flex md:flex-col"
              >
                {/* Foto: coluna estreita no celular, topo do card no desktop */}
                <div className="relative min-h-56 overflow-hidden bg-white md:aspect-[3/4] md:min-h-0">
                  {m.foto && (
                    <Image
                      src={m.foto}
                      alt={`Kit porta pronta ${m.nome} — ${m.material}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 40vw"
                      className="object-contain p-1 md:p-6"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 border-l border-border p-4 md:border-l-0 md:border-t md:p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-medium uppercase tracking-[0.06em] text-foreground">
                        {m.nome}
                      </h3>
                      {m.destaque && (
                        <span className="bg-foreground px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-background">
                          {m.destaque}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {m.disponivel ? `Giro e correr · ${m.material}` : m.material}
                    </p>
                  </div>

                  {m.beneficios.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                      {m.beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[13px] leading-snug">
                          <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {m.prazo && <span className="font-medium text-foreground">{m.prazo}</span>}
                    {m.larguras.length > 0 && (
                      <span>
                        Larguras {faixa(m.larguras)} cm{batente && ` · Batente ${batente} cm`}
                      </span>
                    )}
                  </div>

                  <p className="text-sm">
                    {m.precoBase != null ? (
                      <>
                        <span className="text-muted-foreground">kit a partir de </span>
                        <span className="text-lg font-medium tabular-nums">
                          {formatBRL(m.precoBase)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">Preço sob consulta</span>
                    )}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={`/configurador?cor=${m.slug}`}
                      className="group/cta inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
                    >
                      Montar orçamento
                      <ArrowUpRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                    </Link>
                    <a
                      href={waLink(`Olá! Vi a porta ${m.nome} no site de vocês e gostaria de um orçamento.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-medium uppercase tracking-[0.14em] text-foreground underline underline-offset-4"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">{PAGAMENTO}</p>

        {extras > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVerMais((v) => !v)}
              aria-expanded={verMais}
              className="inline-flex items-center gap-2 border border-foreground px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {verMais ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
              {verMais ? "Ver menos" : `Ver mais ${extras} modelos (madeira)`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
