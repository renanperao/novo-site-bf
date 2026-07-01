import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { ConfiguradorApp } from "@/components/configurador/configurador-app"
import { carregarCatalogo } from "@/lib/catalogo.server"

export const metadata: Metadata = {
  title: "Configurador · Brasil Forte Portas",
  description:
    "Monte sua porta passo a passo. Pré-orçamento online com finalização via WhatsApp.",
}

export default async function ConfiguradorPage() {
  const catalogo = await carregarCatalogo()
  // O deep-link do pré-configurador (?tipo=&cor=) é lido no client (ConfiguradorApp),
  // porque o site é static export (não há searchParams no servidor).
  return (
    <>
      <SiteNavbar />
      {/* App de tela cheia: ocupa a viewport abaixo da navbar fixa (h-16) e trava
          o scroll da página. Sem footer — é uma ferramenta, não página de conteúdo.
          O pt-16 libera o espaço da navbar; overflow-hidden mata o scroll de página. */}
      <main className="h-svh overflow-hidden bg-background pt-16">
        <ConfiguradorApp catalogo={catalogo} />
      </main>
    </>
  )
}
