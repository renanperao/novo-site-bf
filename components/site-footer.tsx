"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const easing = [0.22, 1, 0.36, 1] as const

export function SiteFooter() {
  return (
    <footer id="contato" className="scroll-mt-16 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-12 border-b border-background/15 pb-16 lg:grid-cols-12 lg:gap-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easing }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/60">04 / Contato</p>
            <h2 className="mt-6 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Vamos abrir
              <br />
              <span className="text-background/55">a próxima porta.</span>
            </h2>
            <p className="mt-8 max-w-md text-pretty text-sm leading-relaxed text-background/70">
              Atendemos arquitetos, escritórios e clientes finais com instalação técnica executada por nossa equipe.
              Fale com a Brasil Forte para seu projeto em todo o Litoral de SC.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="mailto:contato@brasilforte.com.br"
                className="inline-flex items-center border border-background bg-background px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-transparent hover:text-background"
              >
                contato@brasilforte.com.br
              </a>
              <a
                href="tel:+554832200195"
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/80 underline-offset-4 hover:text-background hover:underline"
              >
                (48) 3220-0195
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easing, delay: 0.1 }}
            className="grid grid-cols-2 gap-10 lg:col-span-5 lg:grid-cols-2"
          >
            <FooterCol
              title="Ateliê"
              items={[
                "Rua Julio Basilio da Rocha, 11796",
                "Guaporanga, Biguaçu - SC, 88168-274",
                "Seg–Sex · 08h–18h",
              ]}
            />
            <FooterCol
              title="Cobertura"
              items={["Grande Florianópolis", "Vale do Itajaí", "Litoral de SC"]}
            />
            <FooterCol title="Coleção" items={["PET Diamante", "Tauari", "MDF Ultra"]} />
            <FooterCol title="Estúdio" items={["Arquitetos", "Especificadores", "Imprensa"]} />
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 pt-10 font-mono text-[10px] uppercase tracking-[0.22em] text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-preto-bf.png"
              alt="Brasil Forte"
              width={148}
              height={24}
              className="h-5 w-auto object-contain invert"
            />
            <span>· Desde 2022 entregando o melhor em aberturas técnicas no Litoral de SC</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-background">
              Instagram
            </Link>
            <Link href="#" className="hover:text-background">
              Behance
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/55">{title}</p>
      <ul className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.14em] text-background/85">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
