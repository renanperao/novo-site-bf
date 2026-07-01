"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"
import {
  INITIAL_CONFIG,
  calcularPreco,
  formatBRL,
  type Catalogo,
  type ConfiguracaoAtual,
  type ItemOrcamento,
  type Modelo,
  type TipoPorta,
} from "@/lib/catalogo"
import { whatsAppUrl } from "@/lib/whatsapp"
import { ConfiguradorSummary } from "./configurador-summary"
import { ConfiguradorMobileBar } from "./configurador-mobile-bar"
import {
  ResumoPortaAtual,
  StepAcessorios,
  StepDimensao,
  StepInstalacao,
  StepModelo,
  StepQuantidade,
  StepTipo,
} from "./configurador-steps"

const easing = [0.22, 1, 0.36, 1] as const
const DELAY_AVANCO = 200

type PassoKey =
  | "tipo"
  | "modelo"
  | "dimensao"
  | "acessorios"
  | "instalacao"
  | "quantidade"
  | "consulta"

// Rótulo curto (trilha de progresso) e título completo (topo do passo).
const RAIL_LABEL: Record<PassoKey, string> = {
  tipo: "Tipo",
  modelo: "Cor",
  dimensao: "Dimensão",
  acessorios: "Acessórios",
  instalacao: "Instalação",
  quantidade: "Quantidade",
  consulta: "Finalizar",
}
const TITULO: Record<PassoKey, string> = {
  tipo: "Tipo de porta",
  modelo: "Cor e acabamento",
  dimensao: "Dimensão",
  acessorios: "Acessórios",
  instalacao: "Instalação",
  quantidade: "Quantidade",
  consulta: "Acabamento sob consulta",
}
const SUBTITULO: Partial<Record<PassoKey, string>> = {
  tipo: "Como a porta abre",
  modelo: "Brancos principais · demais cores sob consulta",
  dimensao: "Largura e espessura da parede",
  instalacao: "Com nossa equipe ou só a porta",
  quantidade: "Quantas portas você precisa",
}

export function ConfiguradorApp({ catalogo }: { catalogo: Catalogo }) {
  const [config, setConfig] = useState<ConfiguracaoAtual>(INITIAL_CONFIG)
  const [etapa, setEtapa] = useState(0)
  // Portas já adicionadas ao orçamento (a `config` acima é a que está sendo montada).
  const [itens, setItens] = useState<ItemOrcamento[]>([])
  // Mostra avisos vermelhos quando o cliente tenta avançar sem preencher.
  const [mostrarErros, setMostrarErros] = useState(false)
  const shake = useAnimationControls()

  // Deep-link do pré-configurador do hero (?tipo=&cor=). Lido no client porque o
  // site é static export (sem searchParams no servidor). Aplica uma vez ao montar.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const tipoParam = sp.get("tipo")
    const corParam = sp.get("cor")
    const tipoDL: TipoPorta | null =
      tipoParam === "giro" || tipoParam === "correr" ? tipoParam : null
    const corDL =
      corParam && catalogo.modelos.some((m) => m.slug === corParam) ? corParam : null
    if (!tipoDL && !corDL) return
    setConfig((c) => ({
      ...c,
      tipo: tipoDL ?? c.tipo,
      modeloSlug: corDL ?? c.modeloSlug,
    }))
    setEtapa(tipoDL && corDL ? 2 : tipoDL ? 1 : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modelo = useMemo(
    () => catalogo.modelos.find((m) => m.slug === config.modeloSlug) ?? null,
    [catalogo, config.modeloSlug]
  )
  // Cor "sob consulta" (importada): fluxo curto, sem dimensão/acessórios/preço.
  const consulta = !!modelo && !modelo.disponivel

  const passos: PassoKey[] = useMemo(
    () =>
      consulta
        ? ["tipo", "modelo", "consulta"]
        : ["tipo", "modelo", "dimensao", "acessorios", "instalacao", "quantidade"],
    [consulta]
  )

  // Se a lista encurtar (trocar p/ cor sob consulta), mantém a etapa válida.
  useEffect(() => {
    setEtapa((e) => Math.min(e, passos.length - 1))
  }, [passos.length])

  // Limpa os avisos vermelhos ao trocar de passo.
  useEffect(() => {
    setMostrarErros(false)
  }, [etapa])

  // Trava o scroll da página enquanto o configurador está montado: é uma tela
  // única (app), qualquer scroll aqui é indesejado.
  useEffect(() => {
    const anterior = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = anterior
    }
  }, [])

  const patch = (p: Partial<ConfiguracaoAtual>) => setConfig((c) => ({ ...c, ...p }))

  // Validação por passo — controla o botão Continuar e a navegação pela trilha.
  const dimOk =
    consulta ||
    (config.largura != null && (!modelo?.batentes.length || config.batente != null))
  const stepValida = (k: PassoKey): boolean => {
    switch (k) {
      case "tipo":
        return !!config.tipo
      case "modelo":
        return !!config.modeloSlug
      case "dimensao":
        return dimOk
      default:
        return true
    }
  }
  const configCompleta =
    !!config.tipo && !!config.modeloSlug && dimOk && config.quantidade > 0

  const passoAtual = passos[etapa]
  const ultimo = etapa === passos.length - 1
  const podeContinuar = stepValida(passoAtual)
  const podeVoltar = etapa > 0
  const podeIr = (i: number) => passos.slice(0, i).every(stepValida)

  const avancar = () => setEtapa((e) => Math.min(passos.length - 1, e + 1))
  const voltar = () => setEtapa((e) => Math.max(0, e - 1))
  const irPara = (i: number) => {
    if (i <= etapa || podeIr(i)) setEtapa(i)
  }
  const avancarComDelay = () => window.setTimeout(avancar, DELAY_AVANCO)

  // Tenta avançar; se o passo estiver incompleto, treme a tela e mostra os avisos.
  const tentarAvancar = () => {
    if (podeContinuar) {
      setMostrarErros(false)
      avancar()
    } else {
      setMostrarErros(true)
      shake.start({
        x: [0, -10, 10, -8, 8, -4, 4, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      })
    }
  }

  // Adiciona a porta atual ao orçamento e reinicia para montar a próxima.
  const adicionarItem = () => {
    if (!configCompleta) return
    setItens((arr) => [...arr, { id: crypto.randomUUID(), config }])
    setConfig(INITIAL_CONFIG)
    setEtapa(0)
  }
  const removerItem = (id: string) =>
    setItens((arr) => arr.filter((it) => it.id !== id))

  const configsItens = itens.map((it) => it.config)
  const calcAtual = calcularPreco(catalogo, config)
  const waUrl = whatsAppUrl(catalogo, configsItens)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Cabeçalho compacto + trilha de progresso */}
      <div className="shrink-0 border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-10">
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden h-px w-6 bg-foreground sm:block" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Configurador
            </span>
          </div>
          <ProgressRail passos={passos} etapa={etapa} podeIr={podeIr} onIr={irPara} />
        </div>
      </div>

      {/* Corpo: passo atual (esq) + resumo (dir, desktop) */}
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col lg:flex-row">
        {/* Coluna do passo atual */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 lg:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={passoAtual}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: easing }}
              >
                <motion.div animate={shake}>
                  <header className="mb-4 sm:mb-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Passo {etapa + 1} de {passos.length}
                    </p>
                    <h1 className="mt-1 text-xl font-medium uppercase tracking-[-0.01em] sm:text-2xl">
                      {TITULO[passoAtual]}
                    </h1>
                    {SUBTITULO[passoAtual] && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {SUBTITULO[passoAtual]}
                      </p>
                    )}
                  </header>
                  {renderPasso(passoAtual)}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navegação (desktop) */}
          <div className="hidden shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-4 sm:px-6 lg:flex lg:px-10">
            <button
              type="button"
              onClick={voltar}
              disabled={!podeVoltar}
              className="inline-flex items-center gap-2 border border-border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="size-3.5" />
              Voltar
            </button>
            {ultimo ? (
              <button
                type="button"
                onClick={adicionarItem}
                disabled={!configCompleta}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted-foreground"
              >
                <Plus className="size-3.5" />
                Adicionar ao orçamento
                {!calcAtual.consultar && calcAtual.total > 0 && (
                  <span className="tabular-nums">· {formatBRL(calcAtual.total)}</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={tentarAvancar}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Continuar
                <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Resumo lateral (desktop) */}
        <div className="hidden shrink-0 overflow-y-auto overscroll-contain border-l border-border p-4 lg:block lg:w-80 xl:w-96">
          <ConfiguradorSummary
            catalogo={catalogo}
            itens={itens}
            waUrl={waUrl}
            onRemover={removerItem}
          />
        </div>
      </div>

      {/* Barra inferior (mobile) */}
      <div className="shrink-0 border-t border-border bg-background lg:hidden">
        <ConfiguradorMobileBar
          catalogo={catalogo}
          config={config}
          consulta={consulta}
          itensConfigs={configsItens}
          configCompleta={configCompleta}
          ultimo={ultimo}
          podeVoltar={podeVoltar}
          onVoltar={voltar}
          onContinuar={tentarAvancar}
          onAdicionar={adicionarItem}
          waUrl={waUrl}
        />
      </div>
    </div>
  )

  function renderPasso(k: PassoKey): React.ReactNode {
    switch (k) {
      case "tipo":
        return (
          <StepTipo
            valor={config.tipo}
            erro={mostrarErros && !config.tipo}
            onChange={(t: TipoPorta) => {
              patch({ tipo: t })
              avancarComDelay()
            }}
          />
        )

      case "modelo":
        return (
          <StepModelo
            modelos={catalogo.modelos}
            valor={config.modeloSlug}
            erro={mostrarErros && !config.modeloSlug}
            onChange={(slug) => {
              patch({ modeloSlug: slug, largura: null, batente: null })
              // Ambos os fluxos têm o próximo passo no índice 2
              // (disponível → dimensão; sob consulta → finalizar).
              window.setTimeout(() => setEtapa(2), DELAY_AVANCO)
            }}
          />
        )

      case "dimensao":
        if (!modelo) return null
        return (
          <StepDimensao
            modelo={modelo}
            largura={config.largura}
            batente={config.batente}
            erroLargura={mostrarErros && config.largura == null}
            erroBatente={
              mostrarErros && modelo.batentes.length > 0 && config.batente == null
            }
            onLarguraChange={(l) => {
              patch({ largura: l })
              // Só avança quando a dimensão fica completa (largura + batente).
              if (modelo.batentes.length === 0 || config.batente != null) avancarComDelay()
            }}
            onBatenteChange={(b) => {
              patch({ batente: b })
              // Não avança se a largura ainda não foi escolhida.
              if (config.largura != null) avancarComDelay()
            }}
          />
        )

      case "acessorios":
        return <StepAcessorios catalogo={catalogo} config={config} onConfig={patch} />

      case "instalacao":
        if (!config.tipo) return null
        return (
          <StepInstalacao
            catalogo={catalogo}
            tipo={config.tipo}
            incluir={config.incluirInstalacao}
            onChange={(v) => {
              patch({ incluirInstalacao: v })
              avancarComDelay()
            }}
          />
        )

      case "quantidade":
        return (
          <div className="space-y-5">
            {/* Quantidade + subtotal no topo (sempre visível, sem depender de scroll) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border border-border p-4">
              <StepQuantidade
                valor={config.quantidade}
                onChange={(q) => patch({ quantidade: q })}
              />
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Subtotal
                </p>
                <p className="text-2xl leading-none tabular-nums">
                  {formatBRL(calcAtual.total)}
                </p>
                {config.quantidade > 1 && (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {formatBRL(calcAtual.porUnidade)} × {config.quantidade}
                  </p>
                )}
              </div>
            </div>
            <ResumoPortaAtual catalogo={catalogo} config={config} />
          </div>
        )

      case "consulta":
        if (!modelo) return null
        return (
          <ConsultaStep
            modelo={modelo}
            quantidade={config.quantidade}
            onQuantidade={(q) => patch({ quantidade: q })}
          />
        )
    }
  }
}

/* ─────────────────────────────────────────────
   Trilha de progresso (chips numerados, clicáveis)
   ───────────────────────────────────────────── */

function ProgressRail({
  passos,
  etapa,
  podeIr,
  onIr,
}: {
  passos: PassoKey[]
  etapa: number
  podeIr: (i: number) => boolean
  onIr: (i: number) => void
}) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto sm:gap-1.5">
      {passos.map((k, i) => {
        const concluido = i < etapa
        const atual = i === etapa
        const acessivel = i <= etapa || podeIr(i)
        return (
          <li key={k} className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => onIr(i)}
              disabled={!acessivel}
              aria-current={atual ? "step" : undefined}
              className={`group flex items-center gap-2 transition-opacity ${
                acessivel ? "" : "cursor-not-allowed opacity-40"
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[10px] sm:h-7 sm:w-7 sm:text-[11px] ${
                  concluido
                    ? "border-foreground bg-foreground text-background"
                    : atual
                    ? "border-foreground text-foreground ring-1 ring-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {concluido ? <Check className="size-3" /> : i + 1}
              </span>
              <span
                className={`hidden whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] lg:inline ${
                  atual ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {RAIL_LABEL[k]}
              </span>
            </button>
            {i < passos.length - 1 && (
              <span className="h-px w-3 shrink-0 bg-border sm:w-5" aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ─────────────────────────────────────────────
   Passo "sob consulta" (cor importada)
   ───────────────────────────────────────────── */

function ConsultaStep({
  modelo,
  quantidade,
  onQuantidade,
}: {
  modelo: Modelo
  quantidade: number
  onQuantidade: (q: number) => void
}) {
  return (
    <div className="space-y-8">
      <div className="border border-border bg-muted/30 p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Sob consulta
        </p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{modelo.nome}</span> é um
          acabamento importado. Preço, larguras disponíveis e prazo são confirmados
          pela nossa equipe — escolha a quantidade e adicione ao orçamento; enviamos
          o valor personalizado no WhatsApp.
        </p>
      </div>

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          — Quantidade
        </p>
        <StepQuantidade valor={quantidade} onChange={onQuantidade} />
      </div>
    </div>
  )
}
