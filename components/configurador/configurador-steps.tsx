"use client"

import { forwardRef, useId } from "react"
import { Check, X } from "lucide-react"
import { formatBRL, FECHADURA_FUNCOES, SEM_FECHADURA } from "@/lib/catalogo"
import type {
  Catalogo,
  ConfiguracaoAtual,
  Fechadura,
  Modelo,
  TipoPorta,
} from "@/lib/catalogo"

/* ────────────────────────────────────────────────────────────────────
   Wrapper de Section: cabeçalho com número + título + ✓ quando concluído
   ──────────────────────────────────────────────────────────────────── */

export const Section = forwardRef<
  HTMLElement,
  {
    numero: number
    titulo: string
    descricao?: string
    concluido: boolean
    bloqueado: boolean
    children: React.ReactNode
  }
>(function Section({ numero, titulo, descricao, concluido, bloqueado, children }, ref) {
  return (
    <section
      ref={ref}
      className={`scroll-mt-20 border-b border-border py-8 transition-opacity sm:py-10 ${
        bloqueado ? "opacity-30 pointer-events-none select-none" : ""
      }`}
    >
      <header className="mb-6 flex items-baseline gap-3 sm:mb-7 sm:gap-4">
        <span
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center border sm:h-7 sm:w-7 ${
            concluido
              ? "bg-foreground text-background border-foreground"
              : "border-border text-foreground"
          }`}
        >
          {concluido ? <Check className="size-3" /> : (
            <span className="font-mono text-[10px] sm:text-[11px]">{numero}</span>
          )}
        </span>
        <div>
          <h2 className="text-lg font-medium uppercase tracking-[-0.01em] sm:text-2xl">{titulo}</h2>
          {descricao && (
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px]">
              {descricao}
            </p>
          )}
        </div>
      </header>
      <div>{children}</div>
    </section>
  )
})

/* ────────────────────────────────────────────────────────────────────
   STEP 1 · Tipo
   ──────────────────────────────────────────────────────────────────── */

export function StepTipo({
  valor,
  onChange,
  erro,
}: {
  valor: TipoPorta | null
  onChange: (t: TipoPorta) => void
  erro?: boolean
}) {
  const opcoes: { id: TipoPorta; titulo: string; sub: string }[] = [
    { id: "giro", titulo: "Porta de Giro", sub: "Porta de abrir tradicional com dobradiças" },
    { id: "correr", titulo: "Porta de Correr", sub: "Porta deslizante com trilho superior" },
  ]
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {opcoes.map((o) => (
          <OptionCard
            key={o.id}
            selecionado={valor === o.id}
            onClick={() => onChange(o.id)}
          >
            <p className="text-base font-medium uppercase tracking-[-0.01em]">{o.titulo}</p>
            <p className="mt-2 text-xs text-muted-foreground">{o.sub}</p>
          </OptionCard>
        ))}
      </div>
      {erro && <MensagemErro>Selecione o tipo de porta.</MensagemErro>}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   STEP 2 · Modelo (cores)
   ──────────────────────────────────────────────────────────────────── */

export function StepModelo({
  modelos,
  valor,
  onChange,
  erro,
}: {
  modelos: Modelo[]
  valor: string | null
  onChange: (slug: string) => void
  erro?: boolean
}) {
  const disponiveis = modelos.filter((m) => m.disponivel)
  const consulta = modelos.filter((m) => !m.disponivel)

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          — Cores principais
        </p>
        <div className="grid grid-cols-3 gap-2">
          {disponiveis.map((m) => (
            <ModeloCard key={m.slug} modelo={m} selecionado={valor === m.slug} onClick={() => onChange(m.slug)} />
          ))}
        </div>
      </div>

      {consulta.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            — Sob consulta · Outras cores
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-5">
            {consulta.map((m) => (
              <ModeloCard
                key={m.slug}
                modelo={m}
                selecionado={valor === m.slug}
                onClick={() => onChange(m.slug)}
              />
            ))}
          </div>
        </div>
      )}
      {erro && <MensagemErro>Selecione uma cor.</MensagemErro>}
    </div>
  )
}

function ModeloCard({
  modelo,
  selecionado,
  onClick,
}: {
  modelo: Modelo
  selecionado: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col border bg-background text-left transition-all ${
        selecionado
          ? "border-foreground ring-1 ring-foreground"
          : "border-border hover:border-foreground/40"
      }`}
    >
      <div
        className="aspect-[3/2] w-full border-b border-border"
        style={{ background: modelo.hex }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col gap-0.5 p-1.5">
        <p className="text-[11px] font-medium uppercase tracking-[-0.01em] leading-tight sm:text-[12px]">
          {modelo.nome}
        </p>
        {modelo.disponivel ? (
          <p className="font-mono text-[9px] tabular-nums text-muted-foreground">
            {formatBRL(modelo.precoBase ?? 0)}
          </p>
        ) : (
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            Consulte
          </p>
        )}
      </div>
      {selecionado && (
        <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center bg-foreground text-background">
          <Check className="size-2.5" />
        </span>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────
   STEP 3 · Dimensão (largura + batente)
   ──────────────────────────────────────────────────────────────────── */

export function StepDimensao({
  modelo,
  largura,
  batente,
  onLarguraChange,
  onBatenteChange,
  erroLargura,
  erroBatente,
}: {
  modelo: Modelo
  largura: number | null
  batente: string | null
  onLarguraChange: (l: number) => void
  onBatenteChange: (b: string) => void
  erroLargura?: boolean
  erroBatente?: boolean
}) {
  if (!modelo.disponivel) {
    return (
      <div className="border border-dashed border-border p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Modelo importado · Sob consulta
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Pulamos esta etapa: largura, batente e prazo serão confirmados com a equipe via
          WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          — Largura da porta
        </p>
        <div className="flex flex-wrap gap-2">
          {modelo.larguras.map((l) => (
            <Chip key={l} selecionado={largura === l} onClick={() => onLarguraChange(l)}>
              {l} cm
            </Chip>
          ))}
        </div>
        {erroLargura && <MensagemErro>Selecione a largura da porta.</MensagemErro>}
      </div>

      {modelo.batentes.length > 0 && (
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            — Faixa do batente (espessura da parede)
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            Meça a espessura total da parede onde a porta será instalada (em centímetros).
          </p>
          <div className="flex flex-wrap gap-2">
            {modelo.batentes.map((b) => (
              <Chip key={b} selecionado={batente === b} onClick={() => onBatenteChange(b)}>
                {b} cm
              </Chip>
            ))}
          </div>
          {erroBatente && <MensagemErro>Selecione a faixa do batente.</MensagemErro>}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   STEP 4 · Acessórios
   ──────────────────────────────────────────────────────────────────── */

export function StepAcessorios({
  catalogo,
  config,
  onConfig,
}: {
  catalogo: Catalogo
  config: ConfiguracaoAtual
  onConfig: (patch: Partial<ConfiguracaoAtual>) => void
}) {
  const prendeId = useId()
  return (
    <div className="space-y-6">
      {/* Fechadura — inclusa; escolhe função + acabamento */}
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          — Fechadura (inclusa)
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {FECHADURA_FUNCOES.map((fn) => (
            <Chip
              key={fn.id}
              selecionado={config.fechaduraFuncao === fn.id}
              onClick={() => onConfig({ fechaduraFuncao: fn.id })}
            >
              {fn.nome}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {catalogo.fechaduras.map((f) => (
            <FechaduraCard
              key={f.id}
              fechadura={f}
              selecionado={config.fechaduraId === f.id}
              onClick={() => onConfig({ fechaduraId: f.id })}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => onConfig({ fechaduraId: SEM_FECHADURA })}
          className={`mt-2 flex w-full items-center justify-between border px-3 py-2 transition-colors ${
            config.fechaduraId === SEM_FECHADURA
              ? "border-foreground ring-1 ring-foreground"
              : "border-border hover:border-foreground/40"
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-[-0.01em]">
            <X className="size-4" /> Sem fechadura
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
            − {formatBRL(catalogo.descontoSemFechadura)}
          </span>
        </button>
      </div>

      {/* Prende-porta */}
      {catalogo.prendePorta && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={prendeId}
            checked={config.incluirPrendePorta}
            onChange={(e) => onConfig({ incluirPrendePorta: e.target.checked })}
            className="mt-1 size-4 accent-foreground"
          />
          <label htmlFor={prendeId} className="cursor-pointer text-sm">
            <span className="font-medium">Adicionar prende-porta magnético slim</span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              + {formatBRL(catalogo.prendePorta.preco)} · já instalado
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Evita que a porta bata na parede ao abrir.
            </span>
          </label>
        </div>
      )}
    </div>
  )
}

function FechaduraCard({
  fechadura,
  selecionado,
  onClick,
}: {
  fechadura: Fechadura
  selecionado: boolean
  onClick: () => void
}) {
  const precoLabel =
    fechadura.adicional > 0
      ? `+ ${formatBRL(fechadura.adicional)}`
      : fechadura.adicional < 0
      ? `− ${formatBRL(Math.abs(fechadura.adicional))}`
      : "Inclusa"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col border bg-background text-left transition-colors ${
        selecionado
          ? "border-foreground ring-1 ring-foreground"
          : "border-border hover:border-foreground/40"
      }`}
    >
      <div className="flex h-28 w-full items-center justify-center border-b border-border bg-muted/30 p-2 sm:h-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fechadura.foto ?? ""}
          alt={fechadura.nome}
          className="max-h-full w-auto object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        <p className="text-[11px] font-medium uppercase leading-tight tracking-[-0.01em]">
          {fechadura.nome}
        </p>
        <p className="mt-auto pt-1 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
          {precoLabel}
        </p>
      </div>
      {selecionado && (
        <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center bg-foreground text-background">
          <Check className="size-3" />
        </span>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────
   STEP 5 · Instalação
   ──────────────────────────────────────────────────────────────────── */

export function StepInstalacao({
  catalogo,
  tipo,
  incluir,
  onChange,
}: {
  catalogo: Catalogo
  tipo: TipoPorta
  incluir: boolean
  onChange: (incluir: boolean) => void
}) {
  const inst = catalogo.instalacoes[tipo]
  if (!inst) {
    return <p className="text-sm text-muted-foreground">Instalação indisponível para este tipo.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <OptionCard selecionado={incluir} onClick={() => onChange(true)}>
        <p className="text-sm font-medium uppercase tracking-[-0.01em]">Sim, instalar</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Equipe Brasil Forte cuida da medição, ajuste e fixação.
        </p>
        <p className="mt-3 font-mono text-[10px] tabular-nums">
          + {formatBRL(inst.preco)}
        </p>
      </OptionCard>
      <OptionCard selecionado={!incluir} onClick={() => onChange(false)}>
        <p className="text-sm font-medium uppercase tracking-[-0.01em]">Só a porta</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Vou instalar por conta própria ou com outro profissional.
        </p>
      </OptionCard>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   STEP 6 · Quantidade
   ──────────────────────────────────────────────────────────────────── */

export function StepQuantidade({
  valor,
  onChange,
}: {
  valor: number
  onChange: (q: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, valor - 1))}
        className="inline-flex h-12 w-12 items-center justify-center border border-input text-lg hover:bg-muted"
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <input
        type="number"
        min={1}
        max={99}
        value={valor}
        onChange={(e) => onChange(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
        className="h-12 w-20 border border-input bg-background text-center text-lg tabular-nums outline-none focus:border-foreground"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(99, valor + 1))}
        className="inline-flex h-12 w-12 items-center justify-center border border-input text-lg hover:bg-muted"
        aria-label="Aumentar quantidade"
      >
        +
      </button>
      <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {valor === 1 ? "porta" : "portas"}
      </span>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Primitivos reusáveis: OptionCard + Chip
   ──────────────────────────────────────────────────────────────────── */

export function OptionCard({
  selecionado,
  onClick,
  children,
}: {
  selecionado: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start border bg-background p-5 text-left transition-colors ${
        selecionado
          ? "border-foreground ring-1 ring-foreground"
          : "border-border hover:border-foreground/40"
      }`}
    >
      {children}
      {selecionado && (
        <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center bg-foreground text-background">
          <Check className="size-3" />
        </span>
      )}
    </button>
  )
}

export function Chip({
  selecionado,
  onClick,
  children,
}: {
  selecionado: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-sm font-medium uppercase tracking-[-0.01em] transition-colors ${
        selecionado
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  )
}

/** Aviso vermelho mostrado embaixo de um campo obrigatório não preenchido. */
function MensagemErro({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-red-600">
      <span aria-hidden>▲</span>
      {children}
    </p>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Resumo da porta atual — mostrado no passo de Quantidade (revisão)
   ──────────────────────────────────────────────────────────────────── */

export function ResumoPortaAtual({
  catalogo,
  config,
}: {
  catalogo: Catalogo
  config: ConfiguracaoAtual
}) {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  const fechadura = catalogo.fechaduras.find((f) => f.id === config.fechaduraId)
  const instalacao = config.tipo ? catalogo.instalacoes[config.tipo] : null

  const funcaoNome =
    FECHADURA_FUNCOES.find((f) => f.id === config.fechaduraFuncao)?.nome ?? ""
  const sufAdicional = (a: number) =>
    a > 0 ? ` (+ ${formatBRL(a)})` : a < 0 ? ` (− ${formatBRL(Math.abs(a))})` : ""
  const fechaduraLabel =
    config.fechaduraId === SEM_FECHADURA
      ? `Sem fechadura (− ${formatBRL(catalogo.descontoSemFechadura)})`
      : fechadura
      ? `${funcaoNome} · ${fechadura.nome}${sufAdicional(fechadura.adicional)}`
      : `${funcaoNome} · Inclusa`

  return (
    <div className="border border-border">
      <div className="border-b border-border px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Resumo desta porta
        </p>
      </div>
      <dl className="divide-y divide-border text-[13px]">
        <LinhaResumo
          label="Tipo"
          value={
            config.tipo === "giro"
              ? "Porta de Giro"
              : config.tipo === "correr"
              ? "Porta de Correr"
              : "—"
          }
        />
        <LinhaResumo
          label="Cor"
          value={modelo ? `${modelo.nome} · ${modelo.material}` : "—"}
        />
        <LinhaResumo label="Largura" value={config.largura ? `${config.largura} cm` : "—"} />
        {modelo?.batentes.length ? (
          <LinhaResumo label="Batente" value={config.batente ? `${config.batente} cm` : "—"} />
        ) : null}
        <LinhaResumo label="Fechadura" value={fechaduraLabel} />
        <LinhaResumo
          label="Instalação"
          value={
            config.incluirInstalacao && instalacao
              ? `+ ${formatBRL(instalacao.preco)}`
              : "Não incluir"
          }
        />
        {config.incluirPrendePorta && catalogo.prendePorta ? (
          <LinhaResumo
            label="Prende-porta"
            value={`+ ${formatBRL(catalogo.prendePorta.preco)}`}
          />
        ) : null}
      </dl>
    </div>
  )
}

function LinhaResumo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-1.5">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}
