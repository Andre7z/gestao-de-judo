import { FAIXA_ESTILO } from "@/lib/alunos"
import { cn } from "@/lib/utils"

export function FaixaBadge({ faixa, className }: { faixa: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        FAIXA_ESTILO[faixa] ?? "bg-muted text-foreground border border-border",
        className,
      )}
    >
      Faixa {faixa}
    </span>
  )
}
