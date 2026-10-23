import {
  calcularPreco,
  extrasDaConfig,
  fechaduraDaConfig,
  tipoLabel,
  calcularTotalOrcamento,
  formatBRL,
  medidaLabel,
  FECHADURA_FUNCOES,
  SEM_FECHADURA,
  TAXA_MEDICAO,
} from "./catalogo"
import type { Catalogo, ConfiguracaoAtual } from "./catalogo"

export const WA_NUMBER = "554832200195"

/** Link do WhatsApp com mensagem pronta. */
export function waLink(texto: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`
}

function linhasItem(
  catalogo: Catalogo,
  config: ConfiguracaoAtual,
  indice: number
): string[] {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  const fechadura = fechaduraDaConfig(catalogo, config)
  const calc = calcularPreco(catalogo, config)
  const instalacao = config.tipo ? catalogo.instalacoes[config.tipo] : null

  const linhas = [
    `*Porta ${indice}*`,
    `• Tipo: ${tipoLabel(modelo, config)}`,
    `• Modelo: ${modelo ? `${modelo.nome} (${modelo.material})` : "—"}`,
  ]

  // Cor sob consulta: sem itens de preço.
  if (modelo && !modelo.disponivel) {
    linhas.push(`• Quantidade: ${config.quantidade}`)
    linhas.push(`• Acabamento sob consulta`)
    return linhas
  }

  linhas.push(`• Largura: ${medidaLabel(config.largura)}`)
  if (modelo?.batentes.length) {
    linhas.push(`• Batente: ${medidaLabel(config.batente)}`)
  }

  const funcaoNome =
    FECHADURA_FUNCOES.find((f) => f.id === config.fechaduraFuncao)?.nome ?? ""
  const sufAdicional = (a: number) =>
    a > 0
      ? ` (+ ${formatBRL(a)})`
      : a < 0
      ? ` (− ${formatBRL(Math.abs(a))})`
      : " (inclusa)"
  const fechaduraTexto =
    config.fechaduraId === SEM_FECHADURA
      ? `Sem fechadura (− ${formatBRL(catalogo.descontoSemFechadura)})`
      : fechadura
      ? `${funcaoNome} · ${fechadura.nome}${sufAdicional(fechadura.adicional)}`
      : `${funcaoNome} · Inclusa`
  linhas.push(`• Fechadura: ${fechaduraTexto}`)
  linhas.push(
    `• Instalação: ${
      config.incluirInstalacao && instalacao ? `Sim · ${instalacao.nome}` : "Não incluir"
    }`
  )
  for (const e of extrasDaConfig(catalogo, config)) {
    linhas.push(`• Extra: ${e.nome} (+ ${formatBRL(e.preco)})`)
  }
  linhas.push(`• Quantidade: ${config.quantidade}`)
  linhas.push(`• Subtotal: ${calc.estimado ? "a partir de " : ""}${formatBRL(calc.total)}`)
  return linhas
}

export function montaMensagemWhatsApp(
  catalogo: Catalogo,
  itens: ConfiguracaoAtual[]
): string {
  if (itens.length === 0) {
    return "Olá! Gostaria de montar um orçamento de portas com a Brasil Forte."
  }

  const linhas: string[] = ["Olá! Montei um orçamento no site da Brasil Forte:", ""]
  itens.forEach((config, i) => {
    linhas.push(...linhasItem(catalogo, config, i + 1))
    linhas.push("")
  })

  const { total, qtdPortas, temConsulta, estimado } = calcularTotalOrcamento(catalogo, itens)
  if (total > 0) {
    linhas.push(
      `*Total estimado: ${estimado ? "a partir de " : ""}${formatBRL(total)}* (${qtdPortas} ${
        qtdPortas === 1 ? "porta" : "portas"
      })`
    )
  }
  if (estimado) {
    linhas.push(
      `_Não sei alguma medida — quero agendar a medição (${formatBRL(TAXA_MEDICAO)}, abatidos no pedido)._`
    )
  }
  if (temConsulta) {
    linhas.push("_Há itens sob consulta — aguardo preço e prazo._")
  }
  linhas.push("")
  linhas.push(
    "_Valores calculados automaticamente pelo site, não substituem o orçamento oficial. Aguardo confirmação._"
  )
  return linhas.join("\n")
}

export function whatsAppUrl(
  catalogo: Catalogo,
  itens: ConfiguracaoAtual[]
): string {
  return waLink(montaMensagemWhatsApp(catalogo, itens))
}
