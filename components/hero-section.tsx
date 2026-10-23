import Image from "next/image"
import { Star } from "lucide-react"
import { PreConfiguradorCard, type CorPrincipal } from "@/components/pre-configurador-card"
import avaliacoes from "@/data/avaliacoes.json"

// Sem animação de entrada no texto: o título é o maior elemento da tela no
// celular e precisa aparecer na hora (velocidade conta pro Google e pra venda).
export function HeroSection({
  cores,
  maisCores,
  inicial,
}: {
  cores: CorPrincipal[]
  maisCores: number
  inicial: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-24 pb-12 lg:pt-32 lg:pb-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        {/* Desktop: as duas colunas têm a mesma altura; a imagem ocupa o resto da
            esquerda e termina alinhada com o rodapé do card. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="flex flex-col lg:col-span-7">
            <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px w-6 bg-foreground" aria-hidden />
              Grande Florianópolis e Vale do Itajaí
            </p>
            <h1 className="text-balance text-[2.6rem] font-medium uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl lg:tracking-[-0.03em]">
              Kit porta pronta
              <span className="mt-1 block text-[0.62em] leading-[1.05] text-muted-foreground">
                medida, entregue e instalada.
              </span>
            </h1>
            {avaliacoes.nota && (
              <a href="#avaliacoes" className="mt-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 self-start text-sm">
                <span className="flex" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(avaliacoes.nota ?? 0) ? "fill-[#FBBC04] text-[#FBBC04]" : "text-border"}`}
                    />
                  ))}
                </span>
                <span className="font-medium">{avaliacoes.nota.toFixed(1).replace(".", ",")}</span>
                <span className="text-muted-foreground underline underline-offset-4">
                  {avaliacoes.total} avaliações no Google
                </span>
              </a>
            )}

            {/* Imagem ilustrativa (não é obra real: obras reais ficam na seção Obras).
                O espaçador 2:1 garante altura mínima pra porta inteira aparecer (ela
                ocupa ~40% da altura da foto); o flex-1 deixa crescer até o card. */}
            <div className="relative mt-8 hidden flex-1 overflow-hidden border border-border bg-muted lg:block">
              <div className="aspect-[2/1]" aria-hidden />
              <Image
                src="/images/hero-lateral.webp"
                alt="Ambiente residencial com porta branca de alto padrão"
                fill
                priority
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover object-[center_52%]"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <PreConfiguradorCard cores={cores} maisCores={maisCores} inicial={inicial} />
          </div>
        </div>
      </div>
    </section>
  )
}
