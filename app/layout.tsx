import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WhatsappFab } from "@/components/whatsapp-fab"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const TITULO = "Kit Porta Pronta Instalada em Florianópolis e Região | Brasil Forte"
const DESCRICAO =
  "Kit porta pronta branca com batente, vistas e fechadura, com medição e instalação de portas pela nossa equipe. Branco UV a pronta entrega. Grande Florianópolis e Vale do Itajaí. Orçamento online na hora."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITULO, template: "%s | Brasil Forte Portas" },
  description: DESCRICAO,
  keywords: [
    "porta pronta",
    "kit porta pronta",
    "kit porta pronta instalada",
    "porta branca",
    "portas brancas instaladas",
    "instalação de porta",
    "instalação de portas",
    "portas instaladas",
    "porta pronta Florianópolis",
    "porta pronta São José",
    "porta pronta Palhoça",
    "porta pronta Biguaçu",
    "porta pronta Itajaí",
    "porta pronta Balneário Camboriú",
    "porta MDF Ultra",
    "porta branca PET",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Brasil Forte Portas",
    title: TITULO,
    description: DESCRICAO,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Kit porta pronta branca instalada" }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-black.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-white.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        {children}
        <WhatsappFab />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
