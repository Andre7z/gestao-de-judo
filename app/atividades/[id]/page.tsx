"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Trash2,
  AlertTriangle,
  UserPlus,
  X,
  FileDown,
  Printer,
  CalendarDays,
  MapPin,
  Check,
  Shirt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/form-controls"
import { FaixaBadge } from "@/components/faixa-badge"
import { TipoAtividadeBadge } from "@/components/tipo-atividade-badge"
import { useApp } from "@/components/app-provider"
import { TIPOS_ATIVIDADE, formatarData, resumoStatus } from "@/lib/atividades"
import { baixarRelatorioCsv, imprimirRelatorio } from "@/lib/relatorio"
import { cn } from "@/lib/utils"

export default function DetalheAtividadePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const {
    obterAtividade,
    excluirAtividade,
    alunos,
    adicionarParticipantes,
    removerParticipante,
    alternarStatusParticipante,
    atualizarObservacaoParticipante,
  } = useApp()

  const [confirmando, setConfirmando] = useState(false)
  const [adicionando, setAdicionando] = useState(false)

  const atividade = obterAtividade(params.id)

  if (!atividade) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-muted-foreground">Atividade não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/atividades")}>
          Voltar para atividades
        </Button>
      </div>
    )
  }

  const meta = TIPOS_ATIVIDADE[atividade.tipo]
  const { total, confirmados } = resumoStatus(atividade)

  function handleExcluir() {
    excluirAtividade(atividade!.id)
    router.push("/atividades")
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/atividades"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para atividades
      </Link>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between gap-3">
            <TipoAtividadeBadge tipo={atividade.tipo} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmando(true)}
              aria-label="Excluir atividade"
            >
              <Trash2 />
            </Button>
          </div>
          <h1 className="mt-3 text-xl font-semibold text-foreground text-balance">{atividade.titulo}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
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
          </div>
          {atividade.descricao && (
            <p className="mt-3 text-sm text-foreground/80 text-pretty">{atividade.descricao}</p>
          )}
        </div>

        {/* Barra de resumo e relatório */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{confirmados}</strong>/{total}{" "}
            {meta.rotuloStatus.toLowerCase()}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => imprimirRelatorio(atividade)}
              disabled={total === 0}
            >
              <Printer />
              Gerar relatório
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => baixarRelatorioCsv(atividade)}
              disabled={total === 0}
            >
              <FileDown />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Lista de participantes */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Alunos</h2>
            <Button size="sm" onClick={() => setAdicionando(true)}>
              <UserPlus />
              Adicionar alunos
            </Button>
          </div>

          {total === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground text-balance">
                Nenhum aluno adicionado ainda. Clique em &quot;Adicionar alunos&quot; para incluir
                participantes.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {atividade.participantes.map((p) => (
                <li key={p.alunoId} className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={() => alternarStatusParticipante(atividade.id, p.alunoId)}
                    aria-pressed={p.status}
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                      p.status
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:border-primary/50",
                    )}
                    aria-label={`Marcar ${p.nome} como ${meta.rotuloStatus.toLowerCase()}`}
                  >
                    {p.status && <Check className="size-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{p.nome}</span>
                      <span className="text-xs text-muted-foreground">{p.turma}</span>
                    </div>

                    {/* Informações específicas por tipo de atividade */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {atividade.tipo === "kimono" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                          <Shirt className="size-3" />
                          Kimono {p.tamanho_kimono || "—"}
                        </span>
                      )}
                      {atividade.tipo === "faixa" && (
                        <>
                          <FaixaBadge faixa={p.faixa} />
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground border border-border">
                            Tamanho {p.tamanho_faixa || "—"}
                          </span>
                        </>
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          p.status ? "text-green-700" : "text-muted-foreground",
                        )}
                      >
                        {p.status ? meta.rotuloStatus : `Não ${meta.rotuloStatus.toLowerCase()}`}
                      </span>
                    </div>

                    <Input
                      value={p.observacao}
                      onChange={(e) =>
                        atualizarObservacaoParticipante(atividade.id, p.alunoId, e.target.value)
                      }
                      placeholder="Observação (opcional)"
                      className="mt-2 h-8 text-xs"
                      aria-label={`Observação para ${p.nome}`}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removerParticipante(atividade.id, p.alunoId)}
                    aria-label={`Remover ${p.nome}`}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {adicionando && (
        <ModalAdicionarAlunos
          alunosDisponiveis={alunos.filter(
            (a) => !atividade.participantes.some((p) => p.alunoId === a.id),
          )}
          onFechar={() => setAdicionando(false)}
          onConfirmar={(ids) => {
            adicionarParticipantes(atividade.id, ids)
            setAdicionando(false)
          }}
        />
      )}

      {confirmando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmando(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">Excluir atividade</h2>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  Tem certeza que deseja excluir{" "}
                  <strong className="text-foreground">{atividade.titulo}</strong>? Esta ação não pode
                  ser desfeita.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" size="lg" onClick={() => setConfirmando(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" size="lg" onClick={handleExcluir}>
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModalAdicionarAlunos({
  alunosDisponiveis,
  onFechar,
  onConfirmar,
}: {
  alunosDisponiveis: { id: string; nome_aluno: string; turma: string; faixa: string }[]
  onFechar: () => void
  onConfirmar: (ids: string[]) => void
}) {
  const [busca, setBusca] = useState("")
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return alunosDisponiveis
    return alunosDisponiveis.filter((a) => a.nome_aluno.toLowerCase().includes(termo))
  }, [alunosDisponiveis, busca])

  function alternar(id: string) {
    setSelecionados((atuais) => {
      const proximo = new Set(atuais)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-adicionar"
      onClick={onFechar}
    >
      <div
        className="flex max-h-[85dvh] w-full max-w-md flex-col rounded-xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 id="titulo-adicionar" className="text-base font-semibold text-foreground">
            Adicionar alunos
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onFechar} aria-label="Fechar">
            <X />
          </Button>
        </div>

        <div className="border-b border-border p-4">
          <Input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            aria-label="Buscar aluno"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {alunosDisponiveis.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground text-balance">
              Todos os alunos já foram adicionados a esta atividade.
            </p>
          ) : filtrados.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Nenhum aluno encontrado.
            </p>
          ) : (
            <ul className="space-y-1">
              {filtrados.map((a) => {
                const marcado = selecionados.has(a.id)
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => alternar(a.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        marcado ? "bg-primary/10" : "hover:bg-accent/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                          marcado
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background",
                        )}
                      >
                        {marcado && <Check className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-foreground">
                          {a.nome_aluno}
                        </span>
                        <span className="block text-xs text-muted-foreground">{a.turma}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <span className="text-sm text-muted-foreground">
            {selecionados.size} selecionado{selecionados.size === 1 ? "" : "s"}
          </span>
          <Button
            size="lg"
            disabled={selecionados.size === 0}
            onClick={() => onConfirmar(Array.from(selecionados))}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
