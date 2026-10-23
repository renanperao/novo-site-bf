import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

// Fotos reais de obras (out/2026), na ordem escolhida pelo Renan.
// WebP 600×1000 (3:5, perto do retrato do celular: a porta aparece inteira).
const OBRAS = [
  "Corredor com portas pretas instaladas",
  "Duas portas brancas de giro instaladas lado a lado",
  "Porta preta instalada com batente e vistas pretas",
  "Porta de correr branca sobreposta instalada",
  "Corredor com portas brancas instaladas pela Brasil Forte",
  "Porta branca instalada no fim do corredor com piso de madeira",
  "Duas portas brancas instaladas com vistas brancas",
  "Corredor com porta branca e batente branco instalados",
  "Duas portas brancas instaladas em parede clara",
  "Porta branca de giro instalada, aberta",
].map((alt, i) => ({ alt, src: `/images/obras/obra-${String(i + 1).padStart(2, "0")}.webp` }))

export function ObrasSection() {
  return (
    <section id="obras" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Obras reais
        </p>
        <h2 className="mt-3 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl">
          Portas instaladas
          <span className="block text-muted-foreground">pela nossa equipe.</span>
        </h2>
      </div>

      {/* Celular: carrossel com scroll nativo (sem JS). Desktop: grade. */}
      <ul className="mx-auto mt-8 flex max-w-7xl snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-10">
        {OBRAS.map((o) => (
          <li
            key={o.src}
            className="relative aspect-[3/5] w-[72vw] max-w-[320px] shrink-0 snap-start overflow-hidden border border-border bg-muted sm:w-[42vw] lg:w-auto lg:max-w-none"
          >
            <Image
              src={o.src}
              alt={o.alt}
              fill
              sizes="(min-width: 1024px) 20vw, 72vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 max-w-7xl px-5 lg:px-10">
        <a
          href="https://www.instagram.com/portasbrasilforte/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] underline underline-offset-4"
        >
          Mais obras no Instagram
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </section>
  )
}
