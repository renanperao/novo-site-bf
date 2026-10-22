import type { Metadata } from "next"
import { ErrorScreen } from "@/components/error-screen"

export const metadata: Metadata = {
  title: "Página indisponível · Brasil Forte Portas",
}

// Vira out/404.html, que o Apache também usa pra 403/500/503 (ver public/.htaccess),
// por isso o texto é genérico.
export default function NotFound() {
  return (
    <ErrorScreen
      code="Ops"
      title="Essa página não está disponível"
      description="O endereço pode estar errado ou a página está fora do ar no momento. Volte pra home ou fale com a gente no WhatsApp."
    />
  )
}
