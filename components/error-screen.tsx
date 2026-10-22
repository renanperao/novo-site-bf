import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { SiteNavbar } from "@/components/site-navbar"

// Tela única de erro: 404 do Next, erros de runtime (app/error.tsx) e erros do
// Apache (ErrorDocument no public/.htaccess apontando pro 404.html).
// Link com <a> (não <Link>) pra forçar reload completo: o estado do app pode estar quebrado.
export function ErrorScreen({
  code,
  title,
  description,
  children,
}: {
  code: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <>
      <SiteNavbar />
      <main className="flex min-h-svh items-center justify-center bg-background px-6 pt-16">
        <div className="max-w-md text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {code}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-4 text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="h-10 rounded-none bg-foreground px-6 text-[11px] font-medium uppercase tracking-[0.22em] text-background hover:bg-foreground/90"
            >
              <a href="/">Voltar pra home</a>
            </Button>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
