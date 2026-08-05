"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FaixaBadge } from "@/components/faixa-badge"
import { useApp } from "@/components/app-provider"

function LinhaInfo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-muted-foreground">{rotulo}</dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">
        {valor?.trim() ? valor : <span className="font-normal text-muted-foreground">—</span>}
      </dd>
    </div>
  )
}

export default function DetalheAlunoPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { obterAluno, excluirAluno } = useApp()
  const [confirmando, setConfirmando] = useState(false)

  const aluno = obterAluno(params.id)

  if (!aluno) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-muted-foreground">Aluno não encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/alunos")}>
          Voltar para alunos
        </Button>
      </div>
    )
  }

  function handleExcluir() {
    excluirAluno(aluno!.id)
    router.push("/alunos")
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/alunos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para alunos
      </Link>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {aluno.nome_aluno.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-semibold text-foreground text-balance">
                {aluno.nome_aluno}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <FaixaBadge faixa={aluno.faixa} />
                <span className="text-sm text-muted-foreground">{aluno.turma}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <dl>
            <LinhaInfo rotulo="Nome do aluno" valor={aluno.nome_aluno} />
            <LinhaInfo rotulo="CPF" valor={aluno.cpf} />
            <LinhaInfo rotulo="Faixa" valor={aluno.faixa} />
            <LinhaInfo rotulo="Turma" valor={aluno.turma} />
            <LinhaInfo rotulo="Tamanho do kimono" valor={aluno.tamanho_kimono} />
            <LinhaInfo rotulo="Tamanho da faixa" valor={aluno.tamanho_faixa} />
            <LinhaInfo rotulo="Código Zempo" valor={aluno.codigo_zempo} />
          </dl>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border p-6 sm:flex-row sm:justify-end">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => setConfirmando(true)}
          >
            <Trash2 />
            Excluir
          </Button>
          <Button size="lg" onClick={() => router.push(`/alunos/${aluno.id}/editar`)}>
            <Pencil />
            Editar
          </Button>
        </div>
      </div>

      {confirmando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmacao"
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
                <h2 id="titulo-confirmacao" className="text-base font-semibold text-foreground">
                  Excluir aluno
                </h2>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  Tem certeza que deseja excluir{" "}
                  <strong className="text-foreground">{aluno.nome_aluno}</strong>? Esta ação não
                  pode ser desfeita.
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
