"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TipoAtividadeBadge } from "@/components/tipo-atividade-badge"
import { useApp } from "@/components/app-provider"
import {
  TIPOS_ATIVIDADE,
  dataHojeISO,
  formatarData,
  type Atividade,
  type TipoAtividade,
} from "@/lib/atividades"
import { cn } from "@/lib/utils"

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// Cor do ponto indicador por tipo de atividade
const COR_PONTO: Record<TipoAtividade, string> = {
  presenca: "bg-blue-500",
  kimono: "bg-amber-500",
  faixa: "bg-purple-500",
}

function chaveData(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
}

export default function CalendarioPage() {
  const router = useRouter()
  const { atividades } = useApp()

  const hojeIso = dataHojeISO()
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [selecionado, setSelecionado] = useState<string>(hojeIso)

  // Agrupa atividades por data ISO
  const porData = useMemo(() => {
    const mapa = new Map<string, Atividade[]>()
    for (const a of atividades) {
      const lista = mapa.get(a.data) ?? []
      lista.push(a)
      mapa.set(a.data, lista)
    }
    return mapa
  }, [atividades])

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()

  // Células da grade (com espaços vazios antes do dia 1)
  const celulas: (number | null)[] = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ]

  function mudarMes(delta: number) {
    const novaData = new Date(ano, mes + delta, 1)
    setAno(novaData.getFullYear())
    setMes(novaData.getMonth())
  }

  const atividadesDoDia = selecionado ? (porData.get(selecionado) ?? []) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Calendário</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atividades marcadas por data</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        {/* Cabeçalho do mês */}
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon-sm" onClick={() => mudarMes(-1)} aria-label="Mês anterior">
            <ChevronLeft />
          </Button>
          <h2 className="text-base font-semibold text-foreground">
            {MESES[mes]} {ano}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={() => mudarMes(1)} aria-label="Próximo mês">
            <ChevronRight />
          </Button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {DIAS_SEMANA.map((d) => (
            <span key={d} className="py-1 text-xs font-medium text-muted-foreground">
              {d}
            </span>
          ))}
        </div>

        {/* Grade de dias */}
        <div className="mt-1 grid grid-cols-7 gap-1">
          {celulas.map((dia, i) => {
            if (dia === null) return <span key={`vazio-${i}`} />
            const iso = chaveData(ano, mes, dia)
            const eventos = porData.get(iso) ?? []
            const ehHoje = iso === hojeIso
            const ehSelecionado = iso === selecionado
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelecionado(iso)}
                className={cn(
                  "flex aspect-square flex-col items-center gap-1 rounded-lg border p-1 text-sm transition-colors",
                  ehSelecionado
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-accent/50",
                )}
                aria-label={`${dia} de ${MESES[mes]}, ${eventos.length} atividade(s)`}
                aria-pressed={ehSelecionado}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-sm",
                    ehHoje ? "bg-primary font-semibold text-primary-foreground" : "text-foreground",
                  )}
                >
                  {dia}
                </span>
                {eventos.length > 0 && (
                  <span className="flex flex-wrap items-center justify-center gap-0.5">
                    {eventos.slice(0, 3).map((ev, idx) => (
                      <span
                        key={idx}
                        className={cn("size-1.5 rounded-full", COR_PONTO[ev.tipo])}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-4">
          {(Object.keys(TIPOS_ATIVIDADE) as TipoAtividade[]).map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2 rounded-full", COR_PONTO[t])} aria-hidden="true" />
              {TIPOS_ATIVIDADE[t].rotulo}
            </span>
          ))}
        </div>
      </div>

      {/* Painel do dia selecionado */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          {selecionado ? formatarData(selecionado) : "Selecione um dia"}
        </h3>
        {atividadesDoDia.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma atividade marcada neste dia.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {atividadesDoDia.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/atividades/${a.id}`)}
                  className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent/40"
                >
                  <TipoAtividadeBadge tipo={a.tipo} className="self-start" />
                  <span className="font-medium text-foreground">{a.titulo}</span>
                  {a.local && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      {a.local}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
