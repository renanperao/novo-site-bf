/**
 * Lê o catálogo atual do ERP (Supabase) e gera `data/catalogo.json` no site
 * público, no formato consumido pelo configurador e pela home. As fotos são
 * copiadas para `public/images/catalogo/` (o site é estático e não depende do
 * storage do ERP em runtime).
 *
 * Uso: `pnpm sync-catalogo`
 *
 * Credenciais: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do ambiente ou, na
 * falta, do `.env.local` do ERP (ERP_ENV abaixo). A chave só é usada aqui, no
 * build local — nunca vai pro bundle do site.
 */
import { promises as fs } from "fs"
import path from "path"

const ERP_ENV = "c:/Dev/erp-brasil-forte/.env.local"
const OUT_PATH = path.resolve("data/catalogo.json")
const IMG_DIR = path.resolve("public/images/catalogo")
const IMG_URL = "/images/catalogo"
// Fotos próprias do site: `public/images/fotos/<nome>.(jpg|png|webp)` vence a
// foto do ERP com o mesmo <nome> (ex.: branco-uv.jpg, fechadura-padrao.png).
const FOTOS_DIR = path.resolve("public/images/fotos")

// Modelos sem preço fechado: aparecem como "sob consulta" (finaliza no WhatsApp).
// Madeiras primeiro (têm foto própria em public/images/fotos/<slug>.jpg e entram
// na home); depois as cores da Suzin (referência de mercado) que não temos no ERP.
const CORES_CONSULTA = [
  { slug: "madeira-curupixa", nome: "Curupixá", material: "Madeira Curupixá", hex: "#C27A3A" },
  { slug: "tauari-lisa", nome: "Tauari Lisa", material: "Madeira Tauari", hex: "#8A4B22" },
  { slug: "tauari-frisada", nome: "Tauari Frisada", material: "Madeira Tauari", hex: "#7A3F1B" },
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

// Linhas do ERP que o site vende (porta-mãe) → metadata que o ERP não tem.
// Preços, variações, foto, fechadura padrão e adicional de correr vêm do ERP.
// A ordem aqui é a ordem na home e no configurador (Diamante > UV > Gelo).
const MODELOS_BF = {
  // Ordem de brancura (do mais branco pro menos): Diamante > UV > Gelo.
  // Diamante é o "super branco", a porta mais branca de todas → #FFFFFF.
  // `beneficios` e `prazo` são texto de venda (home + configurador), definidos
  // pelo Renan em out/2026.
  "Kit Porta Branco Diamante (PET)": {
    slug: "branco-diamante-pet",
    nomeCurto: "Branco Diamante",
    material: "Revestimento PET",
    hex: "#FFFFFF",
    beneficios: [
      "100% revestida em polímero PET super branco",
      "Alta resistência a riscos e umidade",
      "5 anos de garantia contra amarelecimento",
    ],
    prazo: "Entrega em cerca de 20 dias",
  },
  "Kit Porta Branco UV": {
    slug: "branco-uv",
    nomeCurto: "Branco UV",
    material: "MDF Ultra · Pintura UV",
    hex: "#F6F6F4",
    // Mais vendido hoje: abre no centro da roleta da home.
    destaque: "Mais vendido",
    beneficios: [
      "100% MDF Ultra: porta, batente e vistas",
      "Kit imune a cupins",
      "Altamente resistente à umidade",
    ],
    prazo: "Pronta entrega",
  },
  "Kit Porta Branco Gelo": {
    slug: "branco-gelo",
    nomeCurto: "Branco Gelo",
    material: "Acabamento branco gelo",
    hex: "#ECEFF0",
    beneficios: [
      "Melhor custo-benefício da linha",
      "Boa construção, com batentes mistos",
      "Economia sem perder a beleza da obra",
    ],
    prazo: "Entrega em cerca de 30 dias",
  },
}

// Desconto dado a quem dispensa a fechadura. Valor de NEGÓCIO fixo, não o
// preço da fechadura (o kit já vem com uma; sem ela sai R$70 mais barato).
const DESCONTO_SEM_FECHADURA = 70

// Fechaduras próprias de porta de correr (as demais são de giro).
const FECHADURA_CORRER = /correr|embutid/i

async function lerEnv() {
  const env = { ...process.env }
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) return env
  const txt = await fs.readFile(ERP_ENV, "utf-8")
  for (const linha of txt.split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "")
  }
  env.SUPABASE_URL ||= env.NEXT_PUBLIC_SUPABASE_URL
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(`SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não encontrados (env ou ${ERP_ENV})`)
  }
  return env
}

async function tabela(env, nome) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${nome}?select=*`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  })
  if (!res.ok) throw new Error(`${nome}: HTTP ${res.status} ${await res.text()}`)
  return res.json()
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Foto do item: a do site (public/images/fotos/<nome>.*) se existir; senão baixa
 * a do ERP para public/images/catalogo/<nome>.<ext>. Devolve a URL do site.
 */
async function copiarFoto(url, nome) {
  const propria = (await fs.readdir(FOTOS_DIR).catch(() => [])).find(
    (f) => path.parse(f).name === nome
  )
  if (propria) return `/images/fotos/${propria}`
  if (!url) return null
  const ext = (path.extname(new URL(url).pathname) || ".jpg").toLowerCase()
  const arquivo = `${nome}${ext}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`! foto de "${nome}" falhou (HTTP ${res.status}): ${url}`)
    return null
  }
  await fs.writeFile(path.join(IMG_DIR, arquivo), Buffer.from(await res.arrayBuffer()))
  return `${IMG_URL}/${arquivo}`
}

function parseModelo(s) {
  s = (s || "").trim()
  if (!s) return { largura: null, batente: null }
  // "100cm - Batente 11 a 14" / "100cm - Batente 10 a 15 (MPD)"
  const comBatente = s.match(/^(\d+)\s*c?m\s*-\s*Batente\s*(.+?)\s*$/i)
  if (comBatente) {
    return {
      largura: parseInt(comBatente[1], 10),
      // "(MDP)"/"(MPD)" marca a estrutura das portas de 100 cm no ERP; pro cliente
      // é a mesma faixa de batente (senão o UV mostra 10 faixas, metade sem preço).
      batente: comBatente[2].replace(/\s*\(M[DP][DP]\)/i, "").replace(/\s+/g, " ").trim(),
    }
  }
  // "60cm" / "80CM"
  const soLargura = s.match(/^(\d+)\s*c?m$/i)
  if (soLargura) return { largura: parseInt(soLargura[1], 10), batente: null }
  return { largura: null, batente: null }
}

async function main() {
  const env = await lerEnv()
  const [produtos, [servicos], [opcionaisGerais]] = await Promise.all([
    tabela(env, "produtos"),
    tabela(env, "config_servicos"),
    tabela(env, "config_opcionais"),
  ])

  await fs.rm(IMG_DIR, { recursive: true, force: true })
  await fs.mkdir(IMG_DIR, { recursive: true })

  // === MODELOS BF (kits prontos com largura × batente) ===
  const modelosBF = []
  let fechaduraPadrao = null
  for (const [nomeERP, meta] of Object.entries(MODELOS_BF)) {
    const mae = produtos.find((p) => p.nome === nomeERP && !p.id_pai)
    if (!mae) {
      console.warn(`! modelo "${nomeERP}" não encontrado no ERP`)
      continue
    }
    const variacoes = produtos
      .filter((p) => p.id_pai === mae.id)
      .map((f) => {
        const parsed = parseModelo(f.modelo)
        return parsed.largura
          ? { largura: parsed.largura, batente: parsed.batente, preco: Number(f.preco_base), id: f.id }
          : null
      })
      .filter(Boolean)
      .sort((a, b) => a.largura - b.largura || (a.batente || "").localeCompare(b.batente || ""))

    // Porta de correr = opcionais "correr" da mãe ("Porta de correr — sobrepor",
    // "— embutir"), cada um soma ao preço de giro. O mais barato é o padrão.
    const correr = []
    for (const o of (mae.opcionais ?? []).filter((o) => o.tipo === "correr")) {
      const modo = o.nome.split("—").pop().trim()
      const id = slugify(modo)
      correr.push({
        id,
        nome: modo.charAt(0).toUpperCase() + modo.slice(1),
        adicional: Number(o.preco),
        foto: await copiarFoto(o.foto, `${meta.slug}-correr-${id}`),
      })
    }
    correr.sort((a, b) => a.adicional - b.adicional)

    // Todas as linhas usam a mesma fechadura padrão (Stam Standard 35).
    if (!fechaduraPadrao && mae.fechadura_padrao_modelo) {
      fechaduraPadrao = {
        id: "padrao",
        nome: mae.fechadura_padrao_modelo,
        tipo: "giro",
        adicional: 0,
        foto: await copiarFoto(mae.fechadura_padrao_foto, "fechadura-padrao"),
      }
    }

    modelosBF.push({
      slug: meta.slug,
      nome: meta.nomeCurto,
      nomeCompleto: mae.nome,
      material: meta.material,
      hex: meta.hex,
      foto: await copiarFoto(mae.foto, meta.slug),
      destaque: meta.destaque ?? null,
      beneficios: meta.beneficios ?? [],
      prazo: meta.prazo ?? null,
      disponivel: true,
      precoBase: Math.min(...variacoes.map((v) => v.preco)),
      correr,
      larguras: [...new Set(variacoes.map((v) => v.largura))].sort((a, b) => a - b),
      batentes: [...new Set(variacoes.map((v) => v.batente).filter(Boolean))],
      variacoes,
    })
  }

  // === CORES DA SUZIN QUE NÃO TEMOS (mostra como "Consulte") ===
  const modelosConsulta = []
  for (const c of CORES_CONSULTA) {
    modelosConsulta.push({
      slug: c.slug,
      nome: c.nome,
      nomeCompleto: c.nome,
      material: c.material,
      hex: c.hex,
      foto: await copiarFoto(null, c.slug),
      destaque: null,
      beneficios: [],
      prazo: null,
      disponivel: false,
      precoBase: null,
      correr: [],
      larguras: [],
      batentes: [],
      variacoes: [],
    })
  }

  // === FECHADURAS E EXTRAS (opcionais gerais do ERP) ===
  // Preço do opcional = quanto SOMA ao kit. A padrão do kit vem primeiro (0).
  const gerais = opcionaisGerais?.opcionais ?? []
  const fechaduras = fechaduraPadrao ? [fechaduraPadrao] : []
  const extras = []
  for (const o of gerais) {
    const id = slugify(o.nome)
    if (o.tipo === "fechadura") {
      fechaduras.push({
        id,
        nome: o.nome,
        tipo: FECHADURA_CORRER.test(o.nome) ? "correr" : "giro",
        adicional: Number(o.preco),
        foto: await copiarFoto(o.foto, `fechadura-${id}`),
      })
    } else if (o.tipo === "extra") {
      extras.push({
        id,
        nome: o.nome,
        preco: Number(o.preco),
        foto: await copiarFoto(o.foto, `extra-${id}`),
      })
    }
  }

  // === INSTALAÇÃO (preços em /configuracoes do ERP) ===
  const instalacoes = {
    giro: { id: "giro", nome: "Instalação Porta Interna de Giro", preco: Number(servicos.instalacao_kit) },
    correr: { id: "correr", nome: "Instalação Porta Interna de Correr", preco: Number(servicos.instalacao_correr) },
  }

  const catalogo = {
    geradoEm: new Date().toISOString(),
    modelos: [...modelosBF, ...modelosConsulta],
    fechaduras,
    descontoSemFechadura: DESCONTO_SEM_FECHADURA,
    extras,
    instalacoes,
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true })
  await fs.writeFile(OUT_PATH, JSON.stringify(catalogo, null, 2) + "\n", "utf-8")
  console.log(`✓ catálogo gerado em ${OUT_PATH}`)
  console.log(`  ${modelosBF.length} kits · ${modelosConsulta.length} consulta`)
  console.log(`  ${fechaduras.length} fechaduras · ${extras.length} extras`)
  console.log(`  instalação giro=${instalacoes.giro.preco} correr=${instalacoes.correr.preco}`)
}

main().catch((err) => {
  console.error("Falha:", err)
  process.exit(1)
})
