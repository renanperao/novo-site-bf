import { Plus } from "lucide-react"
import { CIDADES } from "@/lib/conteudo"

export function CidadesSection() {
  return (
    <section id="cidades" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Onde atendemos
        </p>
        <h2 className="mt-3 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl">
          Instalação de portas
          <span className="block text-muted-foreground">na Grande Florianópolis e no Vale do Itajaí.</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {Object.entries(CIDADES).map(([regiao, cidades]) => (
            <div key={regiao}>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.1em]">{regiao}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {cidades.map((c) => (
                  <li key={c} className="border border-border px-2.5 py-1 text-[13px]">
                    {c}
                  </li>
                ))}
                <li className="px-1 py-1 text-[13px] text-muted-foreground">e região</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Perguntas com <details> nativo: abre sem JS e o texto fica no HTML (Google lê). */
export function FaqSection({ perguntas }: { perguntas: { pergunta: string; resposta: string }[] }) {
  return (
    <section id="duvidas" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Dúvidas frequentes
        </p>
        <h2 className="mt-3 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl">
          Perguntas sobre kit porta pronta
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {perguntas.map((q) => (
            <details key={q.pergunta} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium [&::-webkit-details-marker]:hidden">
                {q.pergunta}
                <Plus className="size-4 shrink-0 transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="pb-5 text-pretty text-sm leading-relaxed text-muted-foreground">{q.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
