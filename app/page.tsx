import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { PortasGrid } from "@/components/portas-grid"
import { ObrasSection } from "@/components/obras-section"
import { AvaliacoesSection } from "@/components/avaliacoes-section"
import { ProcessSection } from "@/components/process-section"
import { CidadesSection, FaqSection } from "@/components/faq-section"
import { SiteFooter } from "@/components/site-footer"
import { carregarCatalogo } from "@/lib/catalogo.server"
import { CIDADES, perguntasFrequentes } from "@/lib/conteudo"
import { SITE_URL } from "@/lib/site"

export default async function Page() {
  const catalogo = await carregarCatalogo()
  const disponiveis = catalogo.modelos.filter((m) => m.disponivel)
  // Pré-configurador do hero: foto + preço "a partir de" (correr soma o modo mais barato).
  const cores = disponiveis.map((m) => ({
    slug: m.slug,
    nome: m.nome,
    foto: m.foto,
    fotoCorrer: m.correr[0]?.foto ?? null,
    preco: m.precoBase ?? 0,
    precoCorrer: (m.precoBase ?? 0) + (m.correr[0]?.adicional ?? 0),
  }))
  // Começa marcado no mais vendido (selo `destaque`), senão no primeiro.
  const inicial = (disponiveis.find((m) => m.destaque) ?? disponiveis[0])?.slug ?? ""
  const perguntas = perguntasFrequentes(catalogo)

  // Dados estruturados pro Google: empresa local, os 3 kits com preço e o FAQ.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${SITE_URL}/#empresa`,
        name: "Brasil Forte Portas",
        description:
          "Kit porta pronta com medição, entrega e instalação de portas na Grande Florianópolis e no Vale do Itajaí.",
        url: `${SITE_URL}/`,
        telephone: "+55 48 3220-0195",
        image: `${SITE_URL}/images/og.jpg`,
        logo: `${SITE_URL}/images/logo-preto-bf.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Rua Julio Basilio da Rocha, 11796",
          addressLocality: "Biguaçu",
          addressRegion: "SC",
          postalCode: "88168-274",
          addressCountry: "BR",
        },
        openingHours: "Mo-Fr 08:00-18:00",
        areaServed: Object.values(CIDADES)
          .flat()
          .map((c) => ({ "@type": "City", name: `${c}, SC` })),
        sameAs: ["https://www.instagram.com/portasbrasilforte/"],
        priceRange: "$$",
      },
      ...disponiveis.map((m) => ({
        "@type": "Product",
        name: `Kit Porta Pronta ${m.nome}`,
        description: [m.material, ...m.beneficios].join(". "),
        image: m.foto ? `${SITE_URL}${m.foto}` : undefined,
        brand: { "@type": "Brand", name: "Brasil Forte" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "BRL",
          lowPrice: Math.min(...m.variacoes.map((v) => v.preco)),
          highPrice: Math.max(...m.variacoes.map((v) => v.preco)),
          offerCount: m.variacoes.length,
          availability: "https://schema.org/InStock",
          seller: { "@id": `${SITE_URL}/#empresa` },
        },
      })),
      {
        "@type": "FAQPage",
        mainEntity: perguntas.map((q) => ({
          "@type": "Question",
          name: q.pergunta,
          acceptedAnswer: { "@type": "Answer", text: q.resposta },
        })),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteNavbar />
      <HeroSection
        cores={cores}
        maisCores={catalogo.modelos.length - disponiveis.length}
        inicial={inicial}
      />
      <PortasGrid modelos={catalogo.modelos.filter((m) => m.foto)} />
      <ObrasSection />
      <AvaliacoesSection />
      <ProcessSection modelos={catalogo.modelos} />
      <CidadesSection />
      <FaqSection perguntas={perguntas} />
      <SiteFooter />
    </main>
  )
}
