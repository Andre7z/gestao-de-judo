"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AlunoForm } from "@/components/aluno-form"
import { useApp } from "@/components/app-provider"

export default function NovoAlunoPage() {
  const router = useRouter()
  const { criarAluno } = useApp()

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/alunos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para alunos
      </Link>

      <h1 className="mb-1 text-2xl font-semibold text-foreground">Novo aluno</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Preencha os dados abaixo. Os campos com <span className="text-destructive">*</span> são
        obrigatórios.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <AlunoForm
          textoBotao="Salvar aluno"
          onSubmit={(dados) => {
            const novo = criarAluno(dados)
            router.push(`/alunos/${novo.id}`)
          }}
        />
      </div>
    </div>
  )
}
