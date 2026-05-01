import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { PortasGrid } from "@/components/portas-grid"
import { ProcessSection } from "@/components/process-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <HeroSection />
      <PortasGrid />
      <ProcessSection />
      <SiteFooter />
    </main>
  )
}
