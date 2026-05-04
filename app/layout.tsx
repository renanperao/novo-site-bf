import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WhatsappFab } from "@/components/whatsapp-fab"
import { SmoothScroll } from "@/components/smooth-scroll"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://brasilforte.com"),
  title: "Brasil Forte Portas — Portas de alto padrão para arquitetura",
  description:
    "Especialistas em portas resistentes à maresia, cupim e umidade. Kits completos de PET, MDF Ultra e Madeira Maciça com instalação própria em toda a Grande Florianópolis e Litoral de SC.",
  keywords: [
    "Portas internas Biguaçu",
    "portas resistentes a maresia",
    "instalação de portas SC",
    "MDF Ultra",
    "portas PET Itapema",
  ],
  openGraph: {
    type: "website",
    url: "https://brasilforte.com",
    siteName: "Brasil Forte Portas",
    title: "Brasil Forte Portas — Portas de alto padrão para arquitetura",
    description:
      "Kits completos de PET, MDF Ultra e Madeira Maciça com instalação técnica em toda a Grande Florianópolis e Litoral de SC.",
    images: [
      {
        url: "/images/branca-apartamento.png",
        width: 1200,
        height: 630,
        alt: "Brasil Forte Portas — Porta laqueada em ambiente residencial",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasil Forte Portas — Portas de alto padrão para arquitetura",
    description:
      "Kits completos de PET, MDF Ultra e Madeira Maciça com instalação técnica em toda a Grande Florianópolis e Litoral de SC.",
    images: ["/images/branca-apartamento.png"],
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
