import {
  calcularPreco,
  calcularTotalOrcamento,
  formatBRL,
  FECHADURA_FUNCOES,
  SEM_FECHADURA,
} from "./catalogo"
import type { Catalogo, ConfiguracaoAtual } from "./catalogo"

export const WA_NUMBER = "554832200195"

function linhasItem(
  catalogo: Catalogo,
  config: ConfiguracaoAtual,
  indice: number
): string[] {
  const modelo = catalogo.modelos.find((m) => m.slug === config.modeloSlug)
  const fechadura = catalogo.fechaduras.find((f) => f.id === config.fechaduraId)
  const calc = calcularPreco(catalogo, config)
  const instalacao = config.tipo ? catalogo.instalacoes[config.tipo] : null

  const tipoLabel =
    config.tipo === "giro"
      ? "Porta de Giro"
      : config.tipo === "correr"
      ? "Porta de Correr"
      : "—"

  const linhas = [
    `*Porta ${indice}*`,
    `• Tipo: ${tipoLabel}`,
    `• Modelo: ${modelo ? `${modelo.nome} (${modelo.material})` : "—"}`,
  ]

  // Cor sob consulta: sem itens de preço.
  if (modelo && !modelo.disponivel) {
    linhas.push(`• Quantidade: ${config.quantidade}`)
    linhas.push(`• Acabamento sob consulta`)
    return linhas
  }

  linhas.push(`• Largura: ${config.largura ? `${config.largura} cm` : "—"}`)
  if (modelo?.batentes.length) {
    linhas.push(`• Batente: ${config.batente ? `${config.batente} cm` : "—"}`)
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
  if (config.incluirPrendePorta && catalogo.prendePorta) {
    linhas.push(`• Prende-porta magnético: Sim`)
  }
  linhas.push(`• Quantidade: ${config.quantidade}`)
  linhas.push(`• Subtotal: ${formatBRL(calc.total)}`)
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

  const { total, qtdPortas, temConsulta } = calcularTotalOrcamento(catalogo, itens)
  if (total > 0) {
    linhas.push(
      `*Total estimado: ${formatBRL(total)}* (${qtdPortas} ${
        qtdPortas === 1 ? "porta" : "portas"
      })`
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
  const mensagem = montaMensagemWhatsApp(catalogo, itens)
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensagem)}`
}
