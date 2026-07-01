"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react"
import { calcularPreco, calcularTotalOrcamento, formatBRL } from "@/lib/catalogo"
import type { Catalogo, ConfiguracaoAtual } from "@/lib/catalogo"

const easing = [0.22, 1, 0.36, 1] as const

/**
 * Barra inferior do wizard (mobile), agora orientada a orçamento:
 * - linha de cima (quando há itens): total do orçamento + Finalizar.
 * - linha de baixo: preço da porta atual + Voltar/Continuar (ou Adicionar).
 */
export function ConfiguradorMobileBar({
  catalogo,
  config,
  consulta,
  itensConfigs,
  configCompleta,
  ultimo,
  podeVoltar,
  onVoltar,
  onContinuar,
  onAdicionar,
  waUrl,
}: {
  catalogo: Catalogo
  config: ConfiguracaoAtual
  consulta: boolean
  itensConfigs: ConfiguracaoAtual[]
  configCompleta: boolean
  ultimo: boolean
  podeVoltar: boolean
  onVoltar: () => void
  onContinuar: () => void
  onAdicionar: () => void
  waUrl: string
}) {
  const calcAtual = calcularPreco(catalogo, config)
  const { total, qtdPortas, temConsulta } = calcularTotalOrcamento(catalogo, itensConfigs)
  const temItens = itensConfigs.length > 0

  // Pulsa o botão Finalizar sempre que uma porta é adicionada.
  const pulse = useAnimationControls()
  const prevLen = useRef(itensConfigs.length)
  useEffect(() => {
    if (itensConfigs.length > prevLen.current) {
      pulse.start({
        scale: [1, 1.08, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      })
    }
    prevLen.current = itensConfigs.length
  }, [itensConfigs.length, pulse])

  return (
    <div className="mx-auto max-w-7xl">
      <AnimatePresence initial={false}>
        {temItens && (
          <motion.div
            key="orcamento-bar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: easing }}
            className="overflow-hidden border-b border-border"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2 sm:px-6">
              <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {qtdPortas} {qtdPortas === 1 ? "porta" : "portas"} ·{" "}
                <span className="tabular-nums text-foreground">
                  {total > 0 ? formatBRL(total) : "—"}
                </span>
                {temConsulta ? " + consulta" : ""}
              </span>
              <motion.a
                animate={pulse}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 border border-foreground bg-foreground px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-background"
              >
                Finalizar
                <ArrowUpRight className="size-3" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Esta porta
          </p>
          <p className="truncate text-sm font-medium uppercase tracking-[-0.01em]">
            {consulta
              ? "Sob consulta"
              : calcAtual.total > 0
              ? formatBRL(calcAtual.total)
              : "—"}
          </p>
        </div>

        {podeVoltar && (
          <button
            type="button"
            onClick={onVoltar}
            aria-label="Voltar"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-input transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}

        {ultimo ? (
          <button
            type="button"
            onClick={onAdicionar}
            disabled={!configCompleta}
            className="inline-flex shrink-0 items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-background transition-colors disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted-foreground sm:text-[11px]"
          >
            <Plus className="size-3.5" />
            Adicionar
          </button>
        ) : (
          <button
            type="button"
            onClick={onContinuar}
            className="inline-flex shrink-0 items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-background transition-colors sm:text-[11px]"
          >
            Continuar
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
