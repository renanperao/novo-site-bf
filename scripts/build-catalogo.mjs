/**
 * Lê o `produtos.json` do ERP e gera um `data/catalogo.json` no site público
 * com o formato consumido pelo configurador.
 *
 * Uso: `pnpm sync-catalogo`
 *
 * Se o caminho do ERP mudar, ajuste ERP_PATH abaixo.
 */
import { promises as fs } from "fs"
import path from "path"

const ERP_PATH = "c:/Dev/erp-brasil-forte/data/produtos.json"
const OUT_PATH = path.resolve("data/catalogo.json")

// Cores extras que existem na Suzin (referência de mercado) mas não temos no ERP.
// Aparecem no configurador como "Consulte preço via WhatsApp".
const CORES_CONSULTA = [
  { slug: "cedro-rosso", nome: "Cedro Rosso", material: "Revestimento Melamínico Amadeirado", hex: "#8B4513" },
  { slug: "louro-freijo", nome: "Louro Freijó", material: "Revestimento Melamínico Amadeirado", hex: "#C4A35A" },
  { slug: "preto", nome: "Preto", material: "Revestimento Renolit", hex: "#1A1A1A" },
  { slug: "cinza-chumbo", nome: "Cinza Chumbo", material: "Revestimento PET", hex: "#36454F" },
  { slug: "cinza-claro", nome: "Cinza Claro", material: "Revestimento PET", hex: "#A9A9A9" },
  { slug: "cuprum", nome: "Cuprum", material: "Flexy", hex: "#B87333" },
  { slug: "azurita", nome: "Azurita", material: "Flexy", hex: "#1E3A5F" },
  { slug: "paladio", nome: "Paládio", material: "Flexy", hex: "#BEC2CB" },
  { slug: "malaquita", nome: "Malaquita", material: "Flexy", hex: "#0B6623" },
  { slug: "alabastro", nome: "Alabastro", material: "Flexy", hex: "#F2E8D4" },
]

// Mapeamento de modelos BF (porta-mãe) → metadata extra (hex, material).
// O resto vem do produtos.json.
const MODELOS_BF = {
  // Ordem de brancura (do mais branco pro menos): Diamante > UV > Gelo.
  // Diamante é o "super branco", a porta mais branca de todas → #FFFFFF.
  // `adicionalCorrer` = acréscimo por porta quando o tipo é "correr"
  // (as variações guardam o preço de giro).
  "Kit Porta Branco Diamante (PET)": {
    slug: "branco-diamante-pet",
    nomeCurto: "Branco Diamante",
    material: "Revestimento PET",
    hex: "#FFFFFF",
    adicionalCorrer: 530,
  },
  "Kit Porta Branco Gelo": {
    slug: "branco-gelo",
    nomeCurto: "Branco Gelo",
    material: "Acabamento branco gelo",
    hex: "#ECEFF0",
    adicionalCorrer: 530,
  },
  "Kit Porta Branco UV": {
    slug: "branco-uv",
    nomeCurto: "Branco UV",
    material: "Pintura UV",
    hex: "#F6F6F4",
    adicionalCorrer: 790,
  },
}

function parseModelo(s) {
  s = (s || "").trim()
  if (!s) return { largura: null, batente: null }
  // "100cm - Batente 11 a 14" / "100cm - Batente 10 a 15 (MPD)"
  const comBatente = s.match(/^(\d+)\s*c?m\s*-\s*Batente\s*(.+?)\s*$/i)
  if (comBatente) {
    return {
      largura: parseInt(comBatente[1], 10),
      batente: comBatente[2].replace(/\s+/g, " ").trim(),
    }
  }
  // "60cm" / "80CM"
  const soLargura = s.match(/^(\d+)\s*c?m$/i)
  if (soLargura) return { largura: parseInt(soLargura[1], 10), batente: null }
  return { largura: null, batente: null }
}

async function main() {
  const produtos = JSON.parse(await fs.readFile(ERP_PATH, "utf-8"))
  const byId = new Map(produtos.map((p) => [p.id, p]))
  const filhosPorPai = new Map()
  for (const p of produtos) {
    if (p.idPai) {
      if (!filhosPorPai.has(p.idPai)) filhosPorPai.set(p.idPai, [])
      filhosPorPai.get(p.idPai).push(p)
    }
  }

  // === MODELOS BF (kits prontos com largura × batente) ===
  const modelosBF = []
  for (const [nomeERP, meta] of Object.entries(MODELOS_BF)) {
    const mae = produtos.find((p) => p.nome === nomeERP && !p.idPai)
    if (!mae) {
      console.warn(`! modelo "${nomeERP}" não encontrado no ERP`)
      continue
    }
    const filhos = filhosPorPai.get(mae.id) ?? []
    const variacoes = filhos
      .map((f) => {
        const parsed = parseModelo(f.modelo)
        return parsed.largura
          ? { largura: parsed.largura, batente: parsed.batente, preco: f.precoBase, id: f.id }
          : null
      })
      .filter(Boolean)
      .sort((a, b) => a.largura - b.largura || (a.batente || "").localeCompare(b.batente || ""))

    const larguras = [...new Set(variacoes.map((v) => v.largura))].sort((a, b) => a - b)
    const batentes = [...new Set(variacoes.map((v) => v.batente).filter(Boolean))]

    modelosBF.push({
      slug: meta.slug,
      nome: meta.nomeCurto,
      nomeCompleto: mae.nome,
      material: meta.material,
      hex: meta.hex,
      disponivel: true,
      precoBase: mae.precoBase,
      adicionalCorrer: meta.adicionalCorrer ?? 0,
      larguras,
      batentes,
      variacoes,
    })
  }

  // === MODELOS EM MADEIRA (só largura) ===
  // Lisa Tauari removida do configurador a pedido (não deve aparecer).
  // Para reativar, adicione o nome do produto (como está no ERP) ao array.
  const NOMES_MADEIRA = []
  const modelosMadeira = []
  for (const nome of NOMES_MADEIRA) {
    const mae = produtos.find((p) => p.nome === nome && !p.idPai)
    if (!mae) continue
    const filhos = filhosPorPai.get(mae.id) ?? []
    const variacoes = filhos
      .map((f) => {
        const parsed = parseModelo(f.modelo)
        return parsed.largura ? { largura: parsed.largura, preco: f.precoBase, id: f.id } : null
      })
      .filter(Boolean)
      .sort((a, b) => a.largura - b.largura)
    const larguras = [...new Set(variacoes.map((v) => v.largura))].sort((a, b) => a - b)

    modelosMadeira.push({
      slug: nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      nome: nome.replace(/^Porta\s+(Interna\s+|Maciça\s+)?/i, "").replace(/\s+\d+\s+Almofadas?$/i, ""),
      nomeCompleto: nome,
      material: "Madeira",
      hex: "#C19A6B",
      disponivel: true,
      precoBase: mae.precoBase,
      adicionalCorrer: 0,
      larguras,
      batentes: [],
      variacoes,
    })
  }

  // === CORES DA SUZIN QUE NÃO TEMOS (mostra como "Consulte") ===
  const modelosConsulta = CORES_CONSULTA.map((c) => ({
    slug: c.slug,
    nome: c.nome,
    nomeCompleto: c.nome,
    material: c.material,
    hex: c.hex,
    disponivel: false,
    precoBase: null,
    adicionalCorrer: 0,
    larguras: [],
    batentes: [],
    variacoes: [],
  }))

  // === ACESSÓRIOS ===
  // Fechaduras: lista CURADA (não vêm do ERP). Cada acabamento existe nas versões
  // externa/interna/banheiro (a função é escolhida à parte e não muda o preço).
  // `adicional` = quanto SOMA ao kit: 0 = padrão inclusa; +X = premium; -X = mais
  // simples. Fotos em public/images. Para adicionar/ajustar, edite aqui.
  const fechaduras = [
    {
      id: "roseta-quadrada",
      nome: "813/35 Roseta Quadrada 1 Interna Inox",
      nomeCompleto: "Stam 813/35 Roseta Quadrada 1 Inox",
      preco: 110,
      adicional: 0,
      foto: "/images/fechadura-813-35.webp",
    },
    {
      id: "roseta-redonda",
      nome: "813/21 Roseta Redonda Interna Inox",
      nomeCompleto: "Stam 813/21 Roseta Redonda Inox",
      preco: 80,
      adicional: -30,
      foto: "/images/fechadura-813-21.webp",
    },
    {
      id: "roseta-redonda-escovada",
      nome: "813/39 Roseta Redonda Interna Inox Escovado",
      nomeCompleto: "Stam 813/39 Roseta Redonda Inox Escovado",
      preco: 170,
      adicional: 60,
      foto: "/images/fechadura-813-39.webp",
    },
    {
      id: "home-ix310",
      nome: "Home ix310 Roseta Redonda Externa Inox Escovado",
      nomeCompleto: "Home ix310 Roseta Redonda Inox Escovado",
      preco: 180,
      adicional: 70,
      foto: "/images/fechadura-ix310.webp",
    },
  ]

  // Desconto dado a quem dispensa a fechadura. É um valor de NEGÓCIO fixo, não o
  // preço da fechadura (o kit já vem com uma; sem ela sai R$70 mais barato).
  const descontoSemFechadura = 70

  const instalacoes = {}
  for (const p of produtos) {
    if (/instalação\s+porta.*giro/i.test(p.nome)) {
      // Preço fixo de negócio: R$300 (não o precoBase do ERP).
      instalacoes.giro = { id: p.id, nome: p.nome, preco: 300 }
    }
    if (/instalação\s+porta.*correr/i.test(p.nome)) {
      instalacoes.correr = { id: p.id, nome: p.nome, preco: p.precoBase }
    }
  }

  const batenteAvulso = (() => {
    const mae = produtos.find((p) => p.nome.includes("Batentes e Vistas") && !p.idPai)
    if (!mae) return null
    const filhos = filhosPorPai.get(mae.id) ?? []
    return {
      nome: mae.nome,
      opcoes: filhos
        .map((f) => ({ id: f.id, espessura: f.modelo, preco: f.precoBase }))
        .sort((a, b) => parseInt(a.espessura) - parseInt(b.espessura)),
    }
  })()

  const prendePorta = (() => {
    const p = produtos.find((p) => /prende\s+porta/i.test(p.nome))
    if (!p) return null
    // Preço fixo de negócio: R$45 já instalado (não o precoBase do ERP).
    return { id: p.id, nome: p.nome, preco: 45 }
  })()

  // === Monta catálogo final ===
  const catalogo = {
    geradoEm: new Date().toISOString(),
    modelos: [...modelosBF, ...modelosMadeira, ...modelosConsulta],
    fechaduras,
    descontoSemFechadura,
    instalacoes,
    batenteAvulso,
    prendePorta,
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true })
  await fs.writeFile(OUT_PATH, JSON.stringify(catalogo, null, 2), "utf-8")
  console.log(`✓ catálogo gerado em ${OUT_PATH}`)
  console.log(
    `  ${modelosBF.length} kits PET/UV/Gelo · ${modelosMadeira.length} madeira · ${modelosConsulta.length} consulta`
  )
  console.log(`  ${fechaduras.length} fechaduras · giro=${!!instalacoes.giro} correr=${!!instalacoes.correr}`)
}

main().catch((err) => {
  console.error("Falha:", err)
  process.exit(1)
})
