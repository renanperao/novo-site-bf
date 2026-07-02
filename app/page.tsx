import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { PortasGrid } from "@/components/portas-grid"
import { ProcessSection } from "@/components/process-section"
import { SiteFooter } from "@/components/site-footer"
import { carregarCatalogo } from "@/lib/catalogo.server"

export default async function Page() {
  const catalogo = await carregarCatalogo()
  const disponiveis = catalogo.modelos.filter((m) => m.disponivel)
  const cores = disponiveis.map((m) => ({
    slug: m.slug,
    nome: m.nome,
    hex: m.hex,
    preco: m.precoBase,
  }))
  const coresConsulta = catalogo.modelos
    .filter((m) => !m.disponivel)
    .map((m) => ({ slug: m.slug, nome: m.nome, hex: m.hex, preco: m.precoBase }))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <HeroSection cores={cores} coresConsulta={coresConsulta} />
      <PortasGrid />
      <ProcessSection />
      <SiteFooter />
    </main>
  )
}
