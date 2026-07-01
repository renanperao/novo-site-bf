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
  disponivel: boolean
  precoBase: number | null
  // Acréscimo por porta quando o tipo é "correr" (as variações guardam o preço de giro).
  adicionalCorrer: number
  larguras: number[]
  batentes: string[]
  variacoes: Variacao[]
}

export type Fechadura = {
  id: string
  nome: string
  nomeCompleto: string
  preco: number
  // Quanto esta fechadura SOMA ao preço do kit. 0 = já inclusa no kit;
  // > 0 = modelo premium (upgrade) que acresce no total.
  adicional: number
  foto: string | null
}

export type Instalacao = { id: string; nome: string; preco: number }

export type BatenteAvulso = {
  nome: string
  opcoes: { id: string; espessura: string; preco: number }[]
}

export type Catalogo = {
  geradoEm: string
  modelos: Modelo[]
  fechaduras: Fechadura[]
  // Valor abatido do kit quando o cliente escolhe "sem fechadura"
  // (o kit já vem com uma fechadura inclusa).
  descontoSemFechadura: number
  instalacoes: { giro?: Instalacao; correr?: Instalacao }
  batenteAvulso: BatenteAvulso | null
  prendePorta: { id: string; nome: string; preco: number } | null
}

// fechaduraId com este valor = cliente optou por NÃO levar fechadura (abate o
// desconto). null = fechadura inclusa, tipo ainda a definir (não abate nada).
export const SEM_FECHADURA = "sem-fechadura"

export type TipoPorta = "giro" | "correr"

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
  largura: number | null
  batente: string | null
  fechaduraId: string | null
  fechaduraFuncao: FechaduraFuncao
  incluirInstalacao: boolean
  incluirPrendePorta: boolean
  batenteAvulsoId: string | null
  quantidade: number
}

export const INITIAL_CONFIG: ConfiguracaoAtual = {
  tipo: null,
  modeloSlug: null,
  largura: null,
  batente: null,
  // Acabamento padrão do kit já vem selecionado (adicional 0).
  fechaduraId: "roseta-quadrada",
  fechaduraFuncao: "interna",
  incluirInstalacao: true,
  incluirPrendePorta: false,
  batenteAvulsoId: null,
  quantidade: 1,
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function getVariacao(modelo: Modelo, largura: number | null, batente: string | null) {
  if (!largura) return null
  if (modelo.batentes.length === 0) {
    return modelo.variacoes.find((v) => v.largura === largura) ?? null
  }
  if (!batente) return null
  return modelo.variacoes.find((v) => v.largura === largura && v.batente === batente) ?? null
}

export type CalculoPreco = {
  porta: number
  fechadura: number
  instalacao: number
  prendePorta: number
  batenteAvulso: number
  total: number
  porUnidade: number
  consultar: boolean
}

export function calcularPreco(
  catalogo: Catalogo,
  config: ConfiguracaoAtual
): CalculoPreco {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  if (!modelo || !modelo.disponivel) {
    return {
      porta: 0,
      fechadura: 0,
      instalacao: 0,
      prendePorta: 0,
      batenteAvulso: 0,
      total: 0,
      porUnidade: 0,
      consultar: true,
    }
  }
  const variacao = getVariacao(modelo, config.largura, config.batente)
  // Porta de correr tem acréscimo (por modelo) sobre o kit de giro.
  const portaPreco = variacao
    ? variacao.preco + (config.tipo === "correr" ? modelo.adicionalCorrer : 0)
    : 0
  // A fechadura padrão já está no preço do kit (adicional 0). "Sem fechadura"
  // abate o desconto; modelos premium futuros somam o próprio `adicional`.
  const fechaduraPreco =
    config.fechaduraId === SEM_FECHADURA
      ? -(catalogo.descontoSemFechadura ?? 0)
      : catalogo.fechaduras.find((f) => f.id === config.fechaduraId)?.adicional ?? 0
  const instalacaoPreco =
    config.incluirInstalacao && config.tipo
      ? catalogo.instalacoes[config.tipo]?.preco ?? 0
      : 0
  const prendePrecoUnit =
    config.incluirPrendePorta && catalogo.prendePorta ? catalogo.prendePorta.preco : 0
  const batenteAvulsoPreco =
    catalogo.batenteAvulso?.opcoes.find((o) => o.id === config.batenteAvulsoId)?.preco ?? 0

  const porUnidade =
    portaPreco + fechaduraPreco + instalacaoPreco + prendePrecoUnit + batenteAvulsoPreco
  const total = porUnidade * (config.quantidade || 1)

  return {
    porta: portaPreco,
    fechadura: fechaduraPreco,
    instalacao: instalacaoPreco,
    prendePorta: prendePrecoUnit,
    batenteAvulso: batenteAvulsoPreco,
    total,
    porUnidade,
    consultar: false,
  }
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
    if (config.largura) partes.push(`${config.largura}cm`)
    if (config.batente) partes.push(`bat. ${config.batente}`)
  }
  return partes.join(" · ")
}

export type TotalOrcamento = {
  total: number
  qtdPortas: number
  temConsulta: boolean
}

/** Soma os itens precificados; sinaliza se há itens sob consulta. */
export function calcularTotalOrcamento(
  catalogo: Catalogo,
  itens: ConfiguracaoAtual[]
): TotalOrcamento {
  let total = 0
  let temConsulta = false
  let qtdPortas = 0
  for (const c of itens) {
    qtdPortas += c.quantidade || 1
    const calc = calcularPreco(catalogo, c)
    if (calc.consultar) temConsulta = true
    else total += calc.total
  }
  return { total, qtdPortas, temConsulta }
}
