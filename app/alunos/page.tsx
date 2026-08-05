"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/form-controls"
import { FaixaBadge } from "@/components/faixa-badge"
import { useApp } from "@/components/app-provider"
import { TURMAS } from "@/lib/alunos"

export default function ListagemPage() {
  const router = useRouter()
  const { alunos } = useApp()
  const [busca, setBusca] = useState("")
  const [turma, setTurma] = useState("")

  const filtrados = useMemo(() => {
    return alunos.filter((a) => {
      const casaNome = a.nome_aluno.toLowerCase().includes(busca.trim().toLowerCase())
      const casaTurma = !turma || a.turma === turma
      return casaNome && casaTurma
    })
  }, [alunos, busca, turma])

  const semAlunos = alunos.length === 0
  const semResultados = !semAlunos && filtrados.length === 0

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Alunos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {alunos.length} {alunos.length === 1 ? "aluno cadastrado" : "alunos cadastrados"}
          </p>
        </div>
        <Button size="lg" onClick={() => router.push("/alunos/novo")}>
          <Plus />
          Novo Aluno
        </Button>
      </div>

      {!semAlunos && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome do aluno..."
              className="pl-9"
              aria-label="Buscar por nome do aluno"
            />
          </div>
          <Select
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            aria-label="Filtrar por turma"
            className="sm:w-52"
          >
            <option value="">Todas as turmas</option>
            {TURMAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      )}

      {semAlunos && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Users className="size-6" />
          </span>
          <h2 className="text-lg font-medium text-foreground">Nenhum aluno cadastrado</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground text-balance">
            Comece adicionando o primeiro aluno da sua academia para acompanhar faixas, turmas e
            equipamentos.
          </p>
          <Button size="lg" className="mt-6" onClick={() => router.push("/alunos/novo")}>
            <Plus />
            Cadastrar primeiro aluno
          </Button>
        </div>
      )}

      {semResultados && (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="text-base font-medium text-foreground">Nenhum resultado encontrado</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste a busca ou o filtro de turma para encontrar alunos.
          </p>
        </div>
      )}

      {filtrados.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {filtrados.map((aluno) => (
            <li key={aluno.id}>
              <Link
                href={`/alunos/${aluno.id}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-accent/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {aluno.nome_aluno.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{aluno.nome_aluno}</p>
                  <p className="text-sm text-muted-foreground">{aluno.turma}</p>
                </div>
                <FaixaBadge faixa={aluno.faixa} className="hidden sm:inline-flex" />
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
