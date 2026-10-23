import { ArrowUpRight, Star } from "lucide-react"
import avaliacoes from "@/data/avaliacoes.json"

type Avaliacoes = {
  nota: number | null
  total: number | null
  url: string | null
  depoimentos: { nome: string; texto: string }[]
}

// Dados copiados à mão do perfil do Google (data/avaliacoes.json). Sem nota
// preenchida a seção não aparece.
export function AvaliacoesSection() {
  const { nota, total, url, depoimentos } = avaliacoes as Avaliacoes
  if (!nota) return null
  return (
    <section id="avaliacoes" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Avaliações no Google
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="text-5xl font-medium tabular-nums">{nota.toFixed(1).replace(".", ",")}</span>
          <span className="flex flex-col gap-1 pb-1">
            <span className="flex" aria-label={`Nota ${nota} de 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(nota) ? "fill-[#FBBC04] text-[#FBBC04]" : "text-border"}`}
                />
              ))}
            </span>
            {total && <span className="text-sm text-muted-foreground">{total} avaliações</span>}
          </span>
        </div>

        {depoimentos.length > 0 && (
          <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible">
            {depoimentos.map((d) => (
              <li
                key={d.nome}
                className="w-[80vw] max-w-sm shrink-0 snap-start border border-border p-5 lg:w-auto lg:max-w-none"
              >
                <p className="text-pretty text-sm leading-relaxed">&ldquo;{d.texto}&rdquo;</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {d.nome}
                </p>
              </li>
            ))}
          </ul>
        )}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] underline underline-offset-4"
          >
            Ver todas no Google
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </section>
  )
}
