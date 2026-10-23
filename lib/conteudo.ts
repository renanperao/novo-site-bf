import { formatBRL, TAXA_MEDICAO, type Catalogo } from "./catalogo"

// Texto de venda da home (e do JSON-LD). Fonte: Renan, out/2026.

export const KIT_ITENS = ["Porta", "Batente", "Vistas dos dois lados", "Dobradiças", "Fechadura"]

export const PAGAMENTO = "Pix: 50% no pedido e 50% na entrega · ou em até 12x no cartão"

// Atendemos todas as cidades das duas regiões; estas são as listadas no site.
export const CIDADES = {
  "Grande Florianópolis": [
    "Florianópolis",
    "São José",
    "Palhoça",
    "Biguaçu",
    "Santo Amaro da Imperatriz",
    "Governador Celso Ramos",
    "Antônio Carlos",
    "Águas Mornas",
    "São Pedro de Alcântara",
    "Tijucas",
    "Canelinha",
    "São João Batista",
    "Nova Trento",
    "Paulo Lopes",
    "Garopaba",
    "Rancho Queimado",
    "Angelina",
    "Alfredo Wagner",
  ],
  "Vale do Itajaí": [
    "Itajaí",
    "Balneário Camboriú",
    "Camboriú",
    "Itapema",
    "Porto Belo",
    "Bombinhas",
    "Navegantes",
    "Penha",
    "Balneário Piçarras",
    "Brusque",
    "Guabiruba",
    "Gaspar",
    "Blumenau",
    "Ilhota",
    "Luiz Alves",
    "Indaial",
    "Timbó",
    "Pomerode",
  ],
}

export function perguntasFrequentes(catalogo: Catalogo): { pergunta: string; resposta: string }[] {
  const instGiro = catalogo.instalacoes.giro?.preco
  const instCorrer = catalogo.instalacoes.correr?.preco
  const prazo = (slug: string) => catalogo.modelos.find((m) => m.slug === slug)?.prazo
  return [
    {
      pergunta: "O que vem no kit porta pronta?",
      resposta: `${KIT_ITENS.join(", ")}. A porta já vem pronta, sem pintura nem montagem na obra, e você escolhe se quer a instalação feita pela nossa equipe.`,
    },
    {
      pergunta: "Qual o prazo de entrega?",
      resposta: `Depende do modelo. Branco UV: ${prazo("branco-uv")?.toLowerCase() ?? "pronta entrega"} (conforme estoque). Branco Diamante: ${prazo("branco-diamante-pet")?.toLowerCase() ?? "cerca de 20 dias"}. Branco Gelo: ${prazo("branco-gelo")?.toLowerCase() ?? "cerca de 30 dias"}. O prazo exato e a data da instalação são confirmados no orçamento.`,
    },
    {
      pergunta: "Vocês fazem a instalação das portas?",
      resposta: `Sim, com equipe própria${
        instGiro ? `: ${formatBRL(instGiro)} por porta de giro` : ""
      }${instCorrer ? ` e ${formatBRL(instCorrer)} por porta de correr` : ""}. Fazemos o ajuste fino de batente, vistas e ferragens, e a instalação tem garantia de 3 meses.`,
    },
    {
      pergunta: "Não sei as medidas. E agora?",
      resposta: `Sem problema: nossa equipe mede no local. A visita técnica custa ${formatBRL(TAXA_MEDICAO)} para endereços até 50 km de Biguaçu (acima disso, sob consulta) e o valor é 100% abatido quando você fecha o pedido.`,
    },
    {
      pergunta: "Quais as formas de pagamento?",
      resposta:
        "No Pix, 50% no pedido e 50% na entrega. No cartão, em até 12x (com acréscimo). Para obras, também montamos planos de pagamento mensais via Pix até a conclusão.",
    },
    {
      pergunta: "Qual a garantia?",
      resposta:
        "Todos os kits têm garantia de fábrica. O Branco Diamante tem 5 anos de garantia contra amarelecimento. A instalação feita pela nossa equipe tem garantia de 3 meses.",
    },
    {
      pergunta: "Qual a diferença entre Branco Diamante, Branco UV e Branco Gelo?",
      resposta:
        "Branco Diamante: 100% revestida em polímero PET super branco, a mais branca da linha, resistente a riscos e umidade. Branco UV: 100% MDF Ultra (porta, batente e vistas), imune a cupins e altamente resistente à umidade. Branco Gelo: a opção custo-benefício, com boa construção e batentes mistos.",
    },
    {
      pergunta: "Quais cidades vocês atendem?",
      resposta: `Todas as cidades da Grande Florianópolis e do Vale do Itajaí, como ${[
        ...CIDADES["Grande Florianópolis"].slice(0, 4),
        ...CIDADES["Vale do Itajaí"].slice(0, 5),
      ].join(", ")} e região.`,
    },
  ]
}
