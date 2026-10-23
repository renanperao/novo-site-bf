export type Variacao = {
  largura: number
  batente: string | null
  preco: number
  id: string
}

export type Modelo = {
  slug: string
  nome: string
  nomeCompleto: string
  material: string
  hex: string
  foto: string | null
  // Selo do card na home (ex.: "Mais vendido").
  destaque: string | null
  // Texto de venda (home + configurador) e prazo de entrega ("Pronta entrega"…).
  beneficios: string[]
  prazo: string | null
  disponivel: boolean
  precoBase: number | null
  // Modos da porta de correr (sobrepor/embutir). As variações guardam o preço de
  // GIRO; o modo escolhido soma o próprio `adicional`. O primeiro é o padrão.
  correr: OpcaoCorrer[]
  larguras: number[]
  batentes: string[]
  variacoes: Variacao[]
}

export type OpcaoCorrer = { id: string; nome: string; adicional: number; foto: string | null }

export type Fechadura = {
  id: string
  nome: string
  // Fechaduras de correr só aparecem na porta de correr; as de giro, na de giro.
  tipo: TipoPorta
  // Quanto esta fechadura SOMA ao preço do kit. 0 = já inclusa no kit;
  // > 0 = modelo premium (upgrade) que acresce no total.
  adicional: number
  foto: string | null
}

// Acessório opcional (puxador, prende-porta…): soma o preço por porta.
export type Extra = { id: string; nome: string; preco: number; foto: string | null }

export type Instalacao = { id: string; nome: string; preco: number }

export type Catalogo = {
  geradoEm: string
  modelos: Modelo[]
  fechaduras: Fechadura[]
  // Valor abatido do kit quando o cliente escolhe "sem fechadura"
  // (o kit já vem com uma fechadura inclusa).
  descontoSemFechadura: number
  extras: Extra[]
  instalacoes: { giro?: Instalacao; correr?: Instalacao }
}

// fechaduraId com este valor = cliente optou por NÃO levar fechadura (abate o
// desconto). null (ou id que não vale pro tipo) = primeira fechadura do tipo.
export const SEM_FECHADURA = "sem-fechadura"

export type TipoPorta = "giro" | "correr"

// Cliente não sabe a medida (largura e/ou batente): a equipe mede na visita
// técnica. O preço vira "a partir de" (menor variação compatível).
export const A_MEDIR = "medir"
// Visita de medição: até 50 km de Biguaçu; o valor é 100% abatido no pedido.
export const TAXA_MEDICAO = 100

/** "80 cm" / "11 a 14 cm" / "A medir" / "—" */
export function medidaLabel(v: number | string | null): string {
  return v === A_MEDIR ? "A medir" : v != null ? `${v} cm` : "—"
}

// Função da fechadura (uso). Todos os acabamentos existem nas 3 versões; a
// função não altera o preço, só o adicional do acabamento escolhido é que soma.
export type FechaduraFuncao = "interna" | "externa" | "banheiro"

export const FECHADURA_FUNCOES: { id: FechaduraFuncao; nome: string }[] = [
  { id: "interna", nome: "Interna" },
  { id: "externa", nome: "Externa" },
  { id: "banheiro", nome: "Banheiro" },
]

export type ConfiguracaoAtual = {
  tipo: TipoPorta | null
  modeloSlug: string | null
  // Modo da porta de correr (id de `Modelo.correr`); null = o padrão do modelo.
  correrId: string | null
  largura: number | typeof A_MEDIR | null
  batente: string | null
  fechaduraId: string | null
  fechaduraFuncao: FechaduraFuncao
  incluirInstalacao: boolean
  extras: string[]
  quantidade: number
}

export const INITIAL_CONFIG: ConfiguracaoAtual = {
  tipo: null,
  modeloSlug: null,
  correrId: null,
  largura: null,
  batente: null,
  // null = fechadura padrão do tipo (a primeira da lista, adicional 0).
  fechaduraId: null,
  fechaduraFuncao: "interna",
  incluirInstalacao: true,
  extras: [],
  quantidade: 1,
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function getVariacao(
  modelo: Modelo,
  largura: ConfiguracaoAtual["largura"],
  batente: string | null
): Variacao | null {
  if (largura == null) return null
  if (modelo.batentes.length > 0 && batente == null) return null
  // Com medida "a medir" pode haver várias: vale a mais barata ("a partir de").
  return modelo.variacoes
    .filter(
      (v) =>
        (largura === A_MEDIR || v.largura === largura) &&
        (modelo.batentes.length === 0 || batente === A_MEDIR || v.batente === batente)
    )
    .reduce<Variacao | null>((min, v) => (!min || v.preco < min.preco ? v : min), null)
}

/** Alguma medida ficou "a medir" → preço é estimado ("a partir de"). */
export function temMedida(config: ConfiguracaoAtual): boolean {
  return config.largura === A_MEDIR || config.batente === A_MEDIR
}

/** Modo de correr efetivo (escolhido ou o padrão); null se a porta é de giro. */
export function correrDaConfig(modelo: Modelo, config: ConfiguracaoAtual): OpcaoCorrer | null {
  if (config.tipo !== "correr") return null
  return modelo.correr.find((c) => c.id === config.correrId) ?? modelo.correr[0] ?? null
}

/** Foto da porta como vai ficar: a do modo de correr, se houver; senão a de giro. */
export function fotoDaConfig(modelo: Modelo, config: ConfiguracaoAtual): string | null {
  return correrDaConfig(modelo, config)?.foto ?? modelo.foto
}

/** "Porta de Giro" / "Porta de Correr · Embutir" */
export function tipoLabel(modelo: Modelo | undefined, config: ConfiguracaoAtual): string {
  if (config.tipo === "giro") return "Porta de Giro"
  if (config.tipo !== "correr") return "—"
  const modo = modelo ? correrDaConfig(modelo, config) : null
  return modo ? `Porta de Correr · ${modo.nome}` : "Porta de Correr"
}

export function fechadurasDoTipo(catalogo: Catalogo, tipo: TipoPorta | null): Fechadura[] {
  return catalogo.fechaduras.filter((f) => f.tipo === (tipo ?? "giro"))
}

/** Fechadura efetiva da porta: a escolhida, se vale pro tipo; senão a padrão do tipo. */
export function fechaduraDaConfig(catalogo: Catalogo, config: ConfiguracaoAtual): Fechadura | null {
  if (config.fechaduraId === SEM_FECHADURA) return null
  const opcoes = fechadurasDoTipo(catalogo, config.tipo)
  return opcoes.find((f) => f.id === config.fechaduraId) ?? opcoes[0] ?? null
}

export function extrasDaConfig(catalogo: Catalogo, config: ConfiguracaoAtual): Extra[] {
  return catalogo.extras.filter((e) => config.extras.includes(e.id))
}

export type CalculoPreco = {
  porta: number
  fechadura: number
  instalacao: number
  extras: number
  total: number
  porUnidade: number
  consultar: boolean
  // Medida "a medir": o total é o mínimo, confirmado após a visita.
  estimado: boolean
}

export function calcularPreco(
  catalogo: Catalogo,
  config: ConfiguracaoAtual
): CalculoPreco {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  if (modelo && !modelo.disponivel) {
    return {
      porta: 0,
      fechadura: 0,
      instalacao: 0,
      extras: 0,
      total: 0,
      porUnidade: 0,
      consultar: true,
      estimado: false,
    }
  }
  const variacao = modelo ? getVariacao(modelo, config.largura, config.batente) : null
  // Sem a porta definida (cor/largura/batente) não há preço: nada de mostrar só
  // a instalação como se fosse o preço da porta.
  if (!modelo || !variacao) {
    return {
      porta: 0,
      fechadura: 0,
      instalacao: 0,
      extras: 0,
      total: 0,
      porUnidade: 0,
      consultar: false,
      estimado: false,
    }
  }
  // Porta de correr soma o adicional do modo (sobrepor/embutir) ao kit de giro.
  const portaPreco = variacao.preco + (correrDaConfig(modelo, config)?.adicional ?? 0)
  // A fechadura padrão já está no preço do kit (adicional 0). "Sem fechadura"
  // abate o desconto; modelos premium somam o próprio `adicional`.
  const fechaduraPreco =
    config.fechaduraId === SEM_FECHADURA
      ? -(catalogo.descontoSemFechadura ?? 0)
      : fechaduraDaConfig(catalogo, config)?.adicional ?? 0
  const instalacaoPreco =
    config.incluirInstalacao && config.tipo
      ? catalogo.instalacoes[config.tipo]?.preco ?? 0
      : 0
  const extrasPreco = extrasDaConfig(catalogo, config).reduce((s, e) => s + e.preco, 0)

  const porUnidade = portaPreco + fechaduraPreco + instalacaoPreco + extrasPreco
  const total = porUnidade * (config.quantidade || 1)

  return {
    porta: portaPreco,
    fechadura: fechaduraPreco,
    instalacao: instalacaoPreco,
    extras: extrasPreco,
    total,
    porUnidade,
    consultar: false,
    estimado: temMedida(config),
  }
}

/** "R$ 1.290,00" · "a partir de R$ 1.290,00" · "Sob consulta" · "—" (sem preço ainda) */
export function precoLabel(calc: CalculoPreco): string {
  if (calc.consultar) return "Sob consulta"
  if (calc.total <= 0) return "—"
  return `${calc.estimado ? "a partir de " : ""}${formatBRL(calc.total)}`
}

/* ────────────────────────────────────────────────────────────────────
   Orçamento com várias portas
   ──────────────────────────────────────────────────────────────────── */

export type ItemOrcamento = { id: string; config: ConfiguracaoAtual }

/** Descrição curta de um item do orçamento (para listas/resumos). */
export function resumoCurtoItem(catalogo: Catalogo, config: ConfiguracaoAtual): string {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  const tipo =
    config.tipo === "giro" ? "Giro" : config.tipo === "correr" ? "Correr" : "—"
  const partes: string[] = [tipo, modelo?.nome ?? "—"]
  if (modelo && !modelo.disponivel) {
    partes.push("sob consulta")
  } else {
    if (config.largura != null) partes.push(medidaLabel(config.largura))
    if (config.batente != null) partes.push(`bat. ${medidaLabel(config.batente)}`)
  }
  return partes.join(" · ")
}

export type TotalOrcamento = {
  total: number
  qtdPortas: number
  temConsulta: boolean
  estimado: boolean
}

/** Soma os itens precificados; sinaliza se há itens sob consulta. */
export function calcularTotalOrcamento(
  catalogo: Catalogo,
  itens: ConfiguracaoAtual[]
): TotalOrcamento {
  let total = 0
  let temConsulta = false
  let estimado = false
  let qtdPortas = 0
  for (const c of itens) {
    qtdPortas += c.quantidade || 1
    const calc = calcularPreco(catalogo, c)
    if (calc.consultar) temConsulta = true
    else total += calc.total
    if (calc.estimado) estimado = true
  }
  return { total, qtdPortas, temConsulta, estimado }
}
