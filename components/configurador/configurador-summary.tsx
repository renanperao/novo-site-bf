"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import {
  calcularPreco,
  calcularTotalOrcamento,
  formatBRL,
  resumoCurtoItem,
} from "@/lib/catalogo"
import type { Catalogo, ItemOrcamento } from "@/lib/catalogo"

const easing = [0.22, 1, 0.36, 1] as const

/**
 * Painel do orçamento (desktop). Lista as portas já adicionadas, com total,
 * remoção por item e o botão de finalizar via WhatsApp. Ao adicionar uma porta,
 * o item entra animado e o botão de finalizar pulsa (deixa claro que já dá pra
 * fechar o orçamento).
 */
export function ConfiguradorSummary({
  catalogo,
  itens,
  waUrl,
  onRemover,
}: {
  catalogo: Catalogo
  itens: ItemOrcamento[]
  waUrl: string
  onRemover: (id: string) => void
}) {
  const { total, qtdPortas, temConsulta } = calcularTotalOrcamento(
    catalogo,
    itens.map((i) => i.config)
  )
  const vazio = itens.length === 0

  // Pulsa o botão Finalizar sempre que uma porta é adicionada.
  const pulse = useAnimationControls()
  const prevLen = useRef(itens.length)
  useEffect(() => {
    if (itens.length > prevLen.current) {
      pulse.start({
        scale: [1, 1.06, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      })
    }
    prevLen.current = itens.length
  }, [itens.length, pulse])

  return (
    <aside className="flex h-full flex-col border border-border bg-background">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          Seu orçamento
        </p>
        <p className="mt-1 text-base font-medium uppercase tracking-[-0.01em]">
          {vazio ? "Nenhuma porta" : `${qtdPortas} ${qtdPortas === 1 ? "porta" : "portas"}`}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {vazio ? (
          <p className="px-4 py-6 text-xs leading-relaxed text-muted-foreground">
            Monte sua porta ao lado e clique{" "}
            <span className="text-foreground">"Adicionar ao orçamento"</span>. Você
            pode incluir quantas portas quiser, com medidas e cores diferentes.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {itens.map((it, i) => {
                const calc = calcularPreco(catalogo, it.config)
                return (
                  <motion.li
                    key={it.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: easing }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2 px-4 py-3">
                      <span className="mt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-tight">
                          {resumoCurtoItem(catalogo, it.config)}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
                          ×{it.config.quantidade} ·{" "}
                          {calc.consultar ? "sob consulta" : formatBRL(calc.total)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemover(it.id)}
                        aria-label="Remover porta"
                        className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {!vazio && (
        <div className="shrink-0 border-t border-border px-4 py-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Total
            </span>
            <span className="text-lg tabular-nums">
              {total > 0 ? formatBRL(total) : "—"}
            </span>
          </div>
          {temConsulta && (
            <p className="mt-0.5 text-right font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              + itens sob consulta
            </p>
          )}
        </div>
      )}

      <div className="shrink-0 border-t border-border p-3">
        <motion.a
          animate={pulse}
          href={vazio ? undefined : waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={vazio}
          className={`group inline-flex w-full items-center justify-center gap-2 border px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors ${
            vazio
              ? "cursor-not-allowed border-border text-muted-foreground"
              : "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground"
          }`}
        >
          Finalizar via WhatsApp
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.a>
        {vazio ? (
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Adicione ao menos uma porta
          </p>
        ) : (
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Pronto — pode finalizar ou adicionar mais portas
          </p>
        )}
      </div>
    </aside>
  )
}
