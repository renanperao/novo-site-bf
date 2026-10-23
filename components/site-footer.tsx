import Image from "next/image"
import Link from "next/link"
import { waLink } from "@/lib/whatsapp"
import { WhatsappIcon } from "@/components/whatsapp-fab"

const WA_CONTATO = waLink("Olá! Vim pelo site da Brasil Forte e gostaria de um orçamento de portas.")

export function SiteFooter() {
  return (
    <footer id="contato" className="scroll-mt-16 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-10 border-b border-background/15 pb-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-background/60">Contato</p>
            <h2 className="mt-4 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl">
              Vamos abrir
              <br />
              <span className="text-background/55">a próxima porta.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-background/75">
              Atendemos clientes finais, construtoras e arquitetos, com medição e instalação feitas
              pela nossa equipe.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={WA_CONTATO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              >
                <WhatsappIcon className="size-5" />
                Chamar no WhatsApp
              </a>
              <a
                href="tel:+554832200195"
                className="inline-flex items-center justify-center border border-background/40 px-6 py-4 text-sm font-medium tracking-[0.06em] transition-colors hover:border-background"
              >
                (48) 3220-0195
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5">
            <FooterCol title="Endereço">
              <li>Rua Julio Basilio da Rocha, 11796</li>
              <li>Guaporanga, Biguaçu – SC, 88168-274</li>
              <li>Seg a sex · 8h às 18h</li>
            </FooterCol>
            <FooterCol title="Atendimento">
              <li>Grande Florianópolis</li>
              <li>Vale do Itajaí</li>
              <li>
                <a href="/#cidades" className="underline underline-offset-4 hover:text-background">
                  Ver cidades
                </a>
              </li>
            </FooterCol>
            <FooterCol title="Portas">
              {[
                ["branco-diamante-pet", "Branco Diamante"],
                ["branco-uv", "Branco UV"],
                ["branco-gelo", "Branco Gelo"],
              ].map(([slug, nome]) => (
                <li key={slug}>
                  <Link href={`/configurador?cor=${slug}`} className="hover:text-background hover:underline">
                    {nome}
                  </Link>
                </li>
              ))}
            </FooterCol>
            <FooterCol title="Profissionais">
              <li>
                <a
                  href={waLink("Olá! Sou arquiteto(a)/construtor(a) e gostaria de falar sobre portas para minhas obras.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background hover:underline"
                >
                  Arquitetos e construtoras
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/portasbrasilforte/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background hover:underline"
                >
                  Instagram
                </a>
              </li>
            </FooterCol>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-preto-bf.png"
              alt="Brasil Forte Portas"
              width={148}
              height={24}
              className="h-5 w-auto object-contain invert"
            />
            <span>Kit porta pronta com instalação · desde 2022</span>
          </div>
          <span>© {new Date().getFullYear()} Brasil Forte Portas</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-background/55">{title}</p>
      <ul className="flex flex-col gap-1.5 text-sm text-background/85">{children}</ul>
    </div>
  )
}
