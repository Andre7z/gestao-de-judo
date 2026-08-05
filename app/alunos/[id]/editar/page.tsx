"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlunoForm } from "@/components/aluno-form"
import { useApp } from "@/components/app-provider"

export default function EditarAlunoPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { obterAluno, atualizarAluno } = useApp()

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

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/alunos/${aluno.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para o aluno
      </Link>

      <h1 className="mb-1 text-2xl font-semibold text-foreground">Editar aluno</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Atualize os dados. Os campos com <span className="text-destructive">*</span> são
        obrigatórios.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <AlunoForm
          inicial={aluno}
          textoBotao="Salvar alterações"
          onSubmit={(dados) => {
            atualizarAluno(aluno.id, dados)
            router.push(`/alunos/${aluno.id}`)
          }}
        />
      </div>
    </div>
  )
}
