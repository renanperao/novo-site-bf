"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"
import {
  A_MEDIR,
  INITIAL_CONFIG,
  calcularPreco,
  calcularTotalOrcamento,
  formatBRL,
  fotoDaConfig,
  precoLabel,
  resumoCurtoItem,
  type Catalogo,
  type ConfiguracaoAtual,
  type ItemOrcamento,
  type Modelo,
  type TipoPorta,
} from "@/lib/catalogo"
import { waLink, whatsAppUrl } from "@/lib/whatsapp"
import { WhatsappIcon } from "@/components/whatsapp-fab"
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
// Orçamento salvo no navegador: sobrevive a recarregar a página e a voltar do WhatsApp.
const STORAGE_KEY = "bf-orcamento-v1"

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
  // Porta acabou de entrar no orçamento: tela "enviar no WhatsApp ou adicionar outra".
  const [pronto, setPronto] = useState(false)
  // Só salva depois de restaurar (senão o estado inicial apagaria o salvo).
  const [carregado, setCarregado] = useState(false)
  const shake = useAnimationControls()

  // Ao montar: restaura o orçamento salvo e aplica o deep-link do pré-configurador
  // (?tipo=&cor=) por cima. Lido no client porque o site é static export.
  useEffect(() => {
    let salvo: { itens?: ItemOrcamento[]; config?: ConfiguracaoAtual; etapa?: number } = {}
    try {
      salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {}
    } catch {}
    // Descarta o que não existe mais no catálogo (cor removida num sync).
    const existe = (slug: string | null | undefined) =>
      !slug || catalogo.modelos.some((m) => m.slug === slug)
    setItens(
      (salvo.itens ?? []).filter((it) => it?.config?.modeloSlug && existe(it.config.modeloSlug))
    )

    const sp = new URLSearchParams(window.location.search)
    const tipoParam = sp.get("tipo")
    const corParam = sp.get("cor")
    const tipoDL: TipoPorta | null =
      tipoParam === "giro" || tipoParam === "correr" ? tipoParam : null
    const corDL = corParam && existe(corParam) ? corParam : null
    if (tipoDL || corDL) {
      setConfig({ ...INITIAL_CONFIG, tipo: tipoDL, modeloSlug: corDL })
      setEtapa(tipoDL && corDL ? 2 : tipoDL ? 1 : 0)
      // Tira a query: recarregar não pode sobrescrever a porta em montagem.
      window.history.replaceState(null, "", window.location.pathname)
    } else if (salvo.config && existe(salvo.config.modeloSlug)) {
      setConfig({ ...INITIAL_CONFIG, ...salvo.config })
      setEtapa(salvo.etapa ?? 0)
      // Voltou (ex.: do WhatsApp) com portas no orçamento e nada em montagem:
      // reabre a tela de envio em vez do passo 1.
      if (salvo.itens?.length && !salvo.config.tipo && !salvo.config.modeloSlug) setPronto(true)
    }
    setCarregado(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!carregado) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ itens, config, etapa }))
    } catch {}
  }, [carregado, itens, config, etapa])

  const modelo = useMemo(
    () => catalogo.modelos.find((m) => m.slug === config.modeloSlug) ?? null,
    [catalogo, config.modeloSlug]
  )
  // Cor "sob consulta": fluxo curto, sem dimensão/acessórios/preço.
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
    if (pronto) {
      setPronto(false)
      setEtapa(0)
      return
    }
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

  // Adiciona a porta atual ao orçamento e mostra a tela "enviar ou adicionar outra".
  const adicionarItem = () => {
    if (!configCompleta) return
    // Id simples: crypto.randomUUID() só existe em HTTPS.
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setItens((arr) => [...arr, { id, config }])
    setConfig(INITIAL_CONFIG)
    setEtapa(0)
    setPronto(true)
  }
  const removerItem = (id: string) =>
    setItens((arr) => arr.filter((it) => it.id !== id))

  const configsItens = itens.map((it) => it.config)
  const calcAtual = calcularPreco(catalogo, config)
  const fotoAtual = modelo ? fotoDaConfig(modelo, config) : null
  const waUrl = whatsAppUrl(catalogo, configsItens)
  const telaPronto = pronto && itens.length > 0
  const duvidaUrl = waLink(
    `Olá! Estou montando um orçamento no site e fiquei com uma dúvida${
      modelo && !telaPronto ? ` (porta ${modelo.nome}, passo "${TITULO[passoAtual]}")` : ""
    }: `
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Cabeçalho compacto + trilha de progresso */}
      <div className="shrink-0 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-10">
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="hidden h-px w-6 bg-foreground sm:block" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Orçamento online
            </span>
          </div>
          <div className="min-w-0 sm:ml-auto">
            <ProgressRail
              passos={passos}
              etapa={telaPronto ? -1 : etapa}
              podeIr={podeIr}
              onIr={irPara}
            />
          </div>
          <a
            href={duvidaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 border border-border px-2.5 py-2 text-[12px] font-medium transition-colors hover:border-foreground sm:ml-0"
          >
            <WhatsappIcon className="size-4 text-[#25D366]" />
            Dúvida?<span className="hidden sm:inline"> Fale com a gente</span>
          </a>
        </div>
      </div>

      {/* Corpo: passo atual (esq) + resumo (dir, desktop) */}
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col lg:flex-row">
        {/* Coluna do passo atual */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 lg:px-10">
            <AnimatePresence mode="wait">
              {telaPronto ? (
                <motion.div
                  key="pronto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: easing }}
                >
                  <OrcamentoPronto
                    catalogo={catalogo}
                    itens={itens}
                    waUrl={waUrl}
                    onRemover={removerItem}
                    onOutra={() => setPronto(false)}
                  />
                </motion.div>
              ) : (
              <motion.div
                key={passoAtual}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: easing }}
              >
                <motion.div animate={shake}>
                  <header className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                    <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
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
                    </div>
                    {/* Preview da porta (mobile; no desktop fica no resumo lateral) */}
                    {fotoAtual && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoAtual}
                        alt={`Porta ${modelo?.nome ?? ""}`}
                        className="h-20 w-auto shrink-0 border border-border bg-white object-contain lg:hidden"
                      />
                    )}
                  </header>
                  {renderPasso(passoAtual)}
                </motion.div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navegação (desktop) */}
          <div className={`${telaPronto ? "lg:hidden" : "lg:flex"} hidden shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-4 sm:px-6 lg:px-10`}>
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
                  <span className="tabular-nums">· {precoLabel(calcAtual)}</span>
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
          {fotoAtual && !telaPronto && (
            <div className="mb-4 border border-border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoAtual}
                alt={`Porta ${modelo?.nome ?? ""}`}
                className="mx-auto h-64 w-auto object-contain"
              />
              <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-border px-2 pt-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Esta porta
                </span>
                <span className="text-base tabular-nums">{precoLabel(calcAtual)}</span>
              </div>
            </div>
          )}
          <ConfiguradorSummary
            catalogo={catalogo}
            itens={itens}
            waUrl={waUrl}
            onRemover={removerItem}
          />
        </div>
      </div>

      {/* Barra inferior (mobile) — some na tela "porta adicionada", que tem os próprios botões */}
      <div className={`${telaPronto ? "hidden" : ""} shrink-0 border-t border-border bg-background lg:hidden`}>
        <ConfiguradorMobileBar
          catalogo={catalogo}
          config={config}
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
              // Só avança quando a dimensão fica completa (largura + batente) e
              // nada ficou "a medir" (o aviso da medição precisa ser lido).
              if (
                l !== A_MEDIR &&
                config.batente !== A_MEDIR &&
                (modelo.batentes.length === 0 || config.batente != null)
              )
                avancarComDelay()
            }}
            onBatenteChange={(b) => {
              patch({ batente: b })
              // Não avança se a largura ainda não foi escolhida.
              if (b !== A_MEDIR && config.largura != null && config.largura !== A_MEDIR)
                avancarComDelay()
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
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {calcAtual.estimado ? "Subtotal · a partir de" : "Subtotal"}
                </p>
                <p className="text-2xl leading-none tabular-nums">
                  {formatBRL(calcAtual.total)}
                </p>
                {config.quantidade > 1 && (
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
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
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[11px] sm:h-7 sm:w-7 sm:text-[11px] ${
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
   Tela "porta adicionada": enviar no WhatsApp (principal) ou adicionar outra
   ───────────────────────────────────────────── */

function OrcamentoPronto({
  catalogo,
  itens,
  waUrl,
  onRemover,
  onOutra,
}: {
  catalogo: Catalogo
  itens: ItemOrcamento[]
  waUrl: string
  onRemover: (id: string) => void
  onOutra: () => void
}) {
  const { total, qtdPortas, estimado } = calcularTotalOrcamento(
    catalogo,
    itens.map((i) => i.config)
  )
  return (
    <div className="mx-auto max-w-xl space-y-5 py-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-foreground text-background">
          <Check className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-medium uppercase tracking-[-0.01em] sm:text-2xl">
            Porta adicionada
          </h1>
          <p className="text-sm text-muted-foreground">
            Seu orçamento tem {qtdPortas} {qtdPortas === 1 ? "porta" : "portas"}. Envie pra
            nossa equipe confirmar.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border border border-border text-sm">
        {itens.map((it) => (
          <li key={it.id} className="flex items-start gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              {resumoCurtoItem(catalogo, it.config)}{" "}
              <span className="text-muted-foreground">×{it.config.quantidade}</span>
            </span>
            <span className="shrink-0 tabular-nums">
              {precoLabel(calcularPreco(catalogo, it.config))}
            </span>
            <button
              type="button"
              onClick={() => onRemover(it.id)}
              aria-label="Remover porta"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </li>
        ))}
        {total > 0 && (
          <li className="flex items-baseline justify-between gap-3 px-4 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Total{estimado ? " · a partir de" : ""}
            </span>
            <span className="text-xl tabular-nums">{formatBRL(total)}</span>
          </li>
        )}
      </ul>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2.5 bg-[#25D366] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
      >
        <WhatsappIcon className="size-5" />
        Enviar orçamento no WhatsApp
      </a>
      <button
        type="button"
        onClick={onOutra}
        className="flex w-full items-center justify-center gap-2 border border-foreground px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background"
      >
        <Plus className="size-4" />
        Adicionar outra porta
      </button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        A mensagem já vai com todas as portas e medidas. Nossa equipe confirma valores e
        prazo pelo WhatsApp.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Passo "sob consulta" (sem preço fechado)
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
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Sob consulta
        </p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{modelo.nome}</span> é sob
          consulta. Preço, larguras disponíveis e prazo são confirmados pela nossa
          equipe — escolha a quantidade e adicione ao orçamento; enviamos o valor
          personalizado no WhatsApp.
        </p>
      </div>

      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          — Quantidade
        </p>
        <StepQuantidade valor={quantidade} onChange={onQuantidade} />
      </div>
    </div>
  )
}
