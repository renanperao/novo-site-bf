"use client"

import { Button } from "@/components/ui/button"
import { ErrorScreen } from "@/components/error-screen"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorScreen
      code="Erro"
      title="Algo deu errado"
      description="Tivemos um problema ao carregar esta página. Tente de novo ou volte pra home."
    >
      <Button
        variant="outline"
        onClick={reset}
        className="h-10 rounded-none px-6 text-[11px] font-medium uppercase tracking-[0.22em]"
      >
        Tentar de novo
      </Button>
    </ErrorScreen>
  )
}
