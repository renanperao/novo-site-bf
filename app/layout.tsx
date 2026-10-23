import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { WhatsappFab } from "@/components/whatsapp-fab"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

// Google Ads. Todo clique em WhatsApp (wa.me) ou telefone (tel:) conta como conversão
// "contato" quando CONVERSAO_CONTATO tiver o send_to da ação criada no Google Ads
// (formato "AW-18340286067/xxxxxxxx"). Vazio = só a tag base, sem conversão.
const GOOGLE_ADS_ID = "AW-18340286067"
const CONVERSAO_CONTATO = "AW-18340286067/5PhtCL2rlNUcEPOcqqlE"

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
  // Search Console (propriedade "Prefixo do URL" https://brasilforte.com/).
  verification: { google: "4FVs1H-RmaodXyx6tVQr7tQz6X5_LQ87dHyx9TSPZu8" },
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
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');
var conv='${CONVERSAO_CONTATO}';
if(conv)document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="wa.me/"],a[href^="tel:"]');if(a)gtag('event','conversion',{send_to:conv})},true);`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
