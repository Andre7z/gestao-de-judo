"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ClipboardList, ChevronRight, MapPin, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/form-controls"
import { TipoAtividadeBadge } from "@/components/tipo-atividade-badge"
import { useApp } from "@/components/app-provider"
import {
  TIPOS_ATIVIDADE,
  TIPOS_ATIVIDADE_ORDEM,
  formatarData,
  resumoStatus,
  type TipoAtividade,
} from "@/lib/atividades"

export default function AtividadesPage() {
  const router = useRouter()
  const { atividades } = useApp()
  const [filtroTipo, setFiltroTipo] = useState<"" | TipoAtividade>("")

  const filtradas = useMemo(() => {
    const lista = filtroTipo ? atividades.filter((a) => a.tipo === filtroTipo) : atividades
    return [...lista].sort((a, b) => b.data.localeCompare(a.data))
  }, [atividades, filtroTipo])

  const vazio = atividades.length === 0

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Atividades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {atividades.length} {atividades.length === 1 ? "atividade registrada" : "atividades registradas"}
          </p>
        </div>
        <Button size="lg" onClick={() => router.push("/atividades/nova")}>
          <Plus />
          Nova atividade
        </Button>
      </div>

      {!vazio && (
        <div className="mb-6">
          <Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as "" | TipoAtividade)}
            aria-label="Filtrar por tipo de atividade"
            className="sm:w-64"
          >
            <option value="">Todos os tipos</option>
            {TIPOS_ATIVIDADE_ORDEM.map((t) => (
              <option key={t} value={t}>
                {TIPOS_ATIVIDADE[t].rotulo}
              </option>
            ))}
          </Select>
        </div>
      )}

      {vazio ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ClipboardList className="size-6" />
          </span>
          <h2 className="text-lg font-medium text-foreground">Nenhuma atividade registrada</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground text-balance">
            Crie atividades de controle de presença, entrega de kimono ou exame de faixa para
            acompanhar sua turma.
          </p>
          <Button size="lg" className="mt-6" onClick={() => router.push("/atividades/nova")}>
            <Plus />
            Criar primeira atividade
          </Button>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="text-base font-medium text-foreground">Nenhuma atividade deste tipo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ajuste o filtro para ver outras atividades.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtradas.map((atividade) => {
            const { total, confirmados } = resumoStatus(atividade)
            return (
              <li key={atividade.id}>
                <Link
                  href={`/atividades/${atividade.id}`}
                  className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <TipoAtividadeBadge tipo={atividade.tipo} />
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground text-balance">{atividade.titulo}</h3>
                  <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {formatarData(atividade.data)}
                    </span>
                    {atividade.local && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {atividade.local}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="size-4" />
                      {confirmados}/{total} {TIPOS_ATIVIDADE[atividade.tipo].rotuloStatus.toLowerCase()}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
