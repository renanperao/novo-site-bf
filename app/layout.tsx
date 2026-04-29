import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
