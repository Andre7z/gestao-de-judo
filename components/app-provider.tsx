"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { ALUNOS_INICIAIS, type Aluno } from "@/lib/alunos"

type NovoAluno = Omit<Aluno, "id">

type AppContextType = {
  autenticado: boolean
  entrar: () => void
  sair: () => void
  alunos: Aluno[]
  obterAluno: (id: string) => Aluno | undefined
  criarAluno: (dados: NovoAluno) => Aluno
  atualizarAluno: (id: string, dados: NovoAluno) => void
  excluirAluno: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false)
  const [alunos, setAlunos] = useState<Aluno[]>(ALUNOS_INICIAIS)

  const value = useMemo<AppContextType>(
    () => ({
      autenticado,
      entrar: () => setAutenticado(true),
      sair: () => setAutenticado(false),
      alunos,
      obterAluno: (id) => alunos.find((a) => a.id === id),
      criarAluno: (dados) => {
        const novo: Aluno = { id: crypto.randomUUID(), ...dados }
        setAlunos((atuais) => [novo, ...atuais])
        return novo
      },
      atualizarAluno: (id, dados) => {
        setAlunos((atuais) => atuais.map((a) => (a.id === id ? { ...a, ...dados } : a)))
      },
      excluirAluno: (id) => {
        setAlunos((atuais) => atuais.filter((a) => a.id !== id))
      },
    }),
    [autenticado, alunos],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider")
  return ctx
}
