import { TIPOS_ATIVIDADE, type TipoAtividade } from "@/lib/atividades"
import { cn } from "@/lib/utils"

export function TipoAtividadeBadge({
  tipo,
  className,
}: {
  tipo: TipoAtividade
  className?: string
}) {
  const meta = TIPOS_ATIVIDADE[tipo]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        meta.estilo,
        className,
      )}
    >
      {meta.rotulo}
    </span>
  )
}
