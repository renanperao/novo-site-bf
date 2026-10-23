import { formatBRL, TAXA_MEDICAO, type Modelo } from "@/lib/catalogo"
import { PAGAMENTO } from "@/lib/conteudo"

const steps = (modelos: Modelo[]) => [
  {
    number: "01",
    title: "Orçamento na hora",
    description:
      "Monte sua porta no site ou chame no WhatsApp. Você vê o preço do kit e da instalação na hora, sem esperar retorno.",
  },
  {
    number: "02",
    title: "Medição no local",
    description: `Não sabe as medidas? Nossa equipe mede pra você: ${formatBRL(TAXA_MEDICAO)} até 50 km de Biguaçu, 100% abatido no pedido.`,
  },
  {
    number: "03",
    title: "Entrega e instalação",
    description: `${modelos
      .filter((m) => m.disponivel && m.prazo)
      .map((m) => `${m.nome}: ${m.prazo!.toLowerCase()}`)
      .join(" · ")}. Instalação com equipe própria e garantia de 3 meses.`,
  },
]

export function ProcessSection({ modelos }: { modelos: Modelo[] }) {
  return (
    <section id="processo" className="scroll-mt-16 border-b border-border bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Como funciona
        </p>
        <h2 className="mt-3 text-balance text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] sm:text-5xl">
          Da medida à instalação,
          <span className="block text-muted-foreground">com uma equipe só.</span>
        </h2>

        <ol className="mt-8 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
          {steps(modelos).map((step) => (
            <li key={step.number} className="flex gap-4 bg-background p-5 lg:flex-col lg:p-8">
              <span className="font-mono text-sm text-muted-foreground">{step.number}</span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium uppercase leading-tight tracking-[0.02em] lg:text-xl">
                  {step.title}
                </h3>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Pagamento:</span> {PAGAMENTO}.
        </p>
      </div>
    </section>
  )
}
