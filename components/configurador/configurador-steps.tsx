"use client"

import { Check, Ruler, X } from "lucide-react"
import {
  A_MEDIR,
  correrDaConfig,
  extrasDaConfig,
  fechaduraDaConfig,
  fechadurasDoTipo,
  formatBRL,
  FECHADURA_FUNCOES,
  medidaLabel,
  SEM_FECHADURA,
  TAXA_MEDICAO,
  temMedida,
  tipoLabel,
} from "@/lib/catalogo"
import type { Catalogo, ConfiguracaoAtual, Modelo, TipoPorta } from "@/lib/catalogo"

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
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          — Cores principais
        </p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {disponiveis.map((m) => (
            <ModeloLinha key={m.slug} modelo={m} selecionado={valor === m.slug} onClick={() => onChange(m.slug)} />
          ))}
        </div>
      </div>

      {consulta.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
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

/** Cor principal: swatch + nome + preço + prazo + benefício principal. */
function ModeloLinha({
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
      aria-pressed={selecionado}
      className={`relative flex items-stretch gap-3 border bg-background p-2 text-left transition-all ${
        selecionado
          ? "border-foreground ring-1 ring-foreground"
          : "border-border hover:border-foreground/40"
      }`}
    >
      <span
        className="w-12 shrink-0 border border-border"
        style={{ background: modelo.hex }}
        aria-hidden
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5 pr-6">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium uppercase tracking-[-0.01em]">{modelo.nome}</span>
          {modelo.destaque && (
            <span className="bg-foreground px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-background">
              {modelo.destaque}
            </span>
          )}
        </span>
        <span className="text-xs text-muted-foreground">
          {modelo.beneficios[0] ?? modelo.material}
        </span>
        <span className="mt-0.5 flex flex-wrap gap-x-3 text-xs">
          <span className="tabular-nums">a partir de {formatBRL(modelo.precoBase ?? 0)}</span>
          {modelo.prazo && <span className="text-muted-foreground">{modelo.prazo}</span>}
        </span>
      </span>
      {selecionado && (
        <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center bg-foreground text-background">
          <Check className="size-3" />
        </span>
      )}
    </button>
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
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {formatBRL(modelo.precoBase ?? 0)}
          </p>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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
  largura: ConfiguracaoAtual["largura"]
  batente: string | null
  onLarguraChange: (l: ConfiguracaoAtual["largura"]) => void
  onBatenteChange: (b: string) => void
  erroLargura?: boolean
  erroBatente?: boolean
}) {
  if (!modelo.disponivel) {
    return (
      <div className="border border-dashed border-border p-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Sob consulta
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Pulamos esta etapa: largura, batente e prazo serão confirmados com a equipe via
          WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          — Largura da porta
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Mais comuns: banheiro 60–70 cm · quarto 70–80 cm · entradas amplas 90–100 cm.
        </p>
        <div className="flex flex-wrap gap-2">
          {modelo.larguras.map((l) => (
            <Chip key={l} selecionado={largura === l} onClick={() => onLarguraChange(l)}>
              {l} cm
            </Chip>
          ))}
        </div>
        <BotaoNaoSei selecionado={largura === A_MEDIR} onClick={() => onLarguraChange(A_MEDIR)}>
          Não sei a largura
        </BotaoNaoSei>
        {erroLargura && <MensagemErro>Selecione a largura da porta.</MensagemErro>}
      </div>

      {modelo.batentes.length > 0 && (
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            — Faixa do batente (espessura da parede)
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            Meça a espessura total da parede, já com reboco e revestimento (em centímetros).
          </p>
          <div className="flex flex-wrap gap-2">
            {modelo.batentes.map((b) => (
              <Chip key={b} selecionado={batente === b} onClick={() => onBatenteChange(b)}>
                {b} cm
              </Chip>
            ))}
          </div>
          <BotaoNaoSei selecionado={batente === A_MEDIR} onClick={() => onBatenteChange(A_MEDIR)}>
            Não sei a espessura da parede
          </BotaoNaoSei>
          {erroBatente && <MensagemErro>Selecione a faixa do batente.</MensagemErro>}
        </div>
      )}

      {(largura === A_MEDIR || batente === A_MEDIR) && (
        <div className="flex gap-3 border border-foreground/20 bg-muted/40 p-4">
          <Ruler className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed">
            <span className="font-medium">Sem problema: nossa equipe mede pra você.</span>{" "}
            <span className="text-muted-foreground">
              A visita técnica custa {formatBRL(TAXA_MEDICAO)} (até 50 km de Biguaçu) e o valor
              é 100% abatido no pedido. Até lá, mostramos o preço &ldquo;a partir de&rdquo;.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

/** "Não sei": a maioria não sabe a medida, então fica numa linha própria e em destaque. */
function BotaoNaoSei({
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
      aria-pressed={selecionado}
      className={`mt-3 inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition-colors ${
        selecionado
          ? "border-red-600 bg-red-600 text-white"
          : "border-red-600 text-red-600 hover:bg-red-50"
      }`}
    >
      <Ruler className="size-4" aria-hidden />
      {children}
    </button>
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
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  const correrAtual = modelo ? correrDaConfig(modelo, config) : null
  const fechaduraAtual = fechaduraDaConfig(catalogo, config)
  const alternarExtra = (id: string) =>
    onConfig({
      extras: config.extras.includes(id)
        ? config.extras.filter((e) => e !== id)
        : [...config.extras, id],
    })
  return (
    <div className="space-y-6">
      {/* Porta de correr com mais de um modo (ex.: UV sobrepor/embutir) */}
      {modelo && correrAtual && modelo.correr.length > 1 && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            — Trilho da porta de correr
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modelo.correr.map((c) => (
              <FotoCard
                key={c.id}
                nome={c.nome}
                foto={c.foto}
                precoLabel={`+ ${formatBRL(c.adicional)}`}
                selecionado={correrAtual.id === c.id}
                onClick={() => onConfig({ correrId: c.id })}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Sobrepor: a porta corre por fora da parede. Embutir: a porta corre por dentro da
            parede (exige preparo na obra).
          </p>
        </div>
      )}

      {/* Fechadura — inclusa; escolhe função + acabamento */}
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
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
          {fechadurasDoTipo(catalogo, config.tipo).map((f) => (
            <FotoCard
              key={f.id}
              nome={f.nome}
              foto={f.foto}
              precoLabel={labelAdicional(f.adicional)}
              selecionado={fechaduraAtual?.id === f.id}
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
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
            − {formatBRL(catalogo.descontoSemFechadura)}
          </span>
        </button>
      </div>

      {/* Extras — opcionais, somam por porta */}
      {catalogo.extras.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            — Extras (opcional)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {catalogo.extras.map((e) => (
              <FotoCard
                key={e.id}
                nome={e.nome}
                foto={e.foto}
                precoLabel={`+ ${formatBRL(e.preco)}`}
                selecionado={config.extras.includes(e.id)}
                onClick={() => alternarExtra(e.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function labelAdicional(a: number) {
  return a > 0 ? `+ ${formatBRL(a)}` : a < 0 ? `− ${formatBRL(Math.abs(a))}` : "Inclusa"
}

function FotoCard({
  nome,
  foto,
  precoLabel,
  selecionado,
  onClick,
}: {
  nome: string
  foto: string | null
  precoLabel: string
  selecionado: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionado}
      className={`group relative flex flex-col border bg-background text-left transition-colors ${
        selecionado
          ? "border-foreground ring-1 ring-foreground"
          : "border-border hover:border-foreground/40"
      }`}
    >
      <div className="flex h-28 w-full items-center justify-center border-b border-border bg-muted/30 p-2 sm:h-32">
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={nome} className="max-h-full w-auto object-contain" loading="lazy" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        <p className="text-[11px] font-medium uppercase leading-tight tracking-[-0.01em]">{nome}</p>
        <p className="mt-auto pt-1 font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
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
        <p className="text-sm font-medium uppercase tracking-[-0.01em]">Com instalação</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Equipe Brasil Forte cuida da medição, ajuste e fixação.
        </p>
        <p className="mt-3 font-mono text-[11px] tabular-nums">
          + {formatBRL(inst.preco)}
        </p>
      </OptionCard>
      <OptionCard selecionado={!incluir} onClick={() => onChange(false)}>
        <p className="text-sm font-medium uppercase tracking-[-0.01em]">Sem instalação</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Só a porta: vou instalar por conta própria ou com outro profissional.
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
      <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
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
    <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-red-600">
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
  const fechadura = fechaduraDaConfig(catalogo, config)
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
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Resumo desta porta
        </p>
      </div>
      <dl className="divide-y divide-border text-[13px]">
        <LinhaResumo label="Tipo" value={tipoLabel(modelo, config)} />
        <LinhaResumo
          label="Cor"
          value={modelo ? `${modelo.nome} · ${modelo.material}` : "—"}
        />
        <LinhaResumo label="Largura" value={medidaLabel(config.largura)} />
        {modelo?.batentes.length ? (
          <LinhaResumo label="Batente" value={medidaLabel(config.batente)} />
        ) : null}
        {temMedida(config) && (
          <LinhaResumo
            label="Medição"
            value={`Visita técnica · ${formatBRL(TAXA_MEDICAO)} abatidos no pedido`}
          />
        )}
        <LinhaResumo label="Fechadura" value={fechaduraLabel} />
        <LinhaResumo
          label="Instalação"
          value={
            config.incluirInstalacao && instalacao
              ? `+ ${formatBRL(instalacao.preco)}`
              : "Não incluir"
          }
        />
        {extrasDaConfig(catalogo, config).map((e) => (
          <LinhaResumo key={e.id} label="Extra" value={`${e.nome} · + ${formatBRL(e.preco)}`} />
        ))}
      </dl>
    </div>
  )
}

function LinhaResumo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-1.5">
      <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}
