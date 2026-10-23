// Checagem rápida das regras de preço do configurador: `node scripts/check-precos.mjs`
// (Node 24 roda o .ts direto). Falha com AssertionError se alguma regra quebrar.
import assert from "node:assert/strict"
import catalogo from "../data/catalogo.json" with { type: "json" }
import { A_MEDIR, INITIAL_CONFIG, calcularPreco, getVariacao, precoLabel } from "../lib/catalogo.ts"

const uv = catalogo.modelos.find((m) => m.slug === "branco-uv")
const cfg = (p) => ({ ...INITIAL_CONFIG, tipo: "giro", modeloSlug: "branco-uv", ...p })

// Faixas do UV normalizadas: 100 cm usa as mesmas faixas que as outras larguras.
assert.equal(uv.batentes.length, 5)
assert.equal(getVariacao(uv, 100, "10 a 15")?.preco, 1620)
// "Não sei" = menor preço compatível.
assert.equal(getVariacao(uv, A_MEDIR, "13 a 18")?.preco, 1260)
assert.equal(getVariacao(uv, A_MEDIR, A_MEDIR)?.preco, 1210)
// Porta sem medida não tem preço (antes mostrava só a instalação, R$ 300).
assert.equal(calcularPreco(catalogo, cfg({})).total, 0)
assert.equal(precoLabel(calcularPreco(catalogo, cfg({}))), "—")
assert.equal(precoLabel(calcularPreco(catalogo, { ...INITIAL_CONFIG })), "—")
// Porta completa: kit + instalação; medida "a medir" vira "a partir de".
assert.equal(calcularPreco(catalogo, cfg({ largura: 80, batente: "10 a 15" })).total, 1230 + 300)
const est = calcularPreco(catalogo, cfg({ largura: A_MEDIR, batente: A_MEDIR }))
assert.equal(est.estimado, true)
assert.match(precoLabel(est), /^a partir de R\$/)
// Cor sob consulta continua sem preço.
assert.equal(precoLabel(calcularPreco(catalogo, { ...INITIAL_CONFIG, modeloSlug: "madeira-curupixa" })), "Sob consulta")
console.log("✓ preços ok")
