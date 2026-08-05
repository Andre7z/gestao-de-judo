"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Campo, Input, Label } from "@/components/form-controls"
import { useApp } from "@/components/app-provider"

// Credenciais de exemplo fixas (protótipo, sem autenticação real)
const EMAIL_DEMO = "professor@dojo.com"
const SENHA_DEMO = "judo123"

export default function LoginPage() {
  const router = useRouter()
  const { entrar } = useApp()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!email || !senha) {
      setErro("Preencha o e-mail e a senha para continuar.")
      return
    }
    if (email !== EMAIL_DEMO || senha !== SENHA_DEMO) {
      setErro("E-mail ou senha incorretos. Verifique os dados e tente novamente.")
      return
    }
    entrar()
    router.push("/alunos")
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Swords className="size-6" />
          </span>
          <h1 className="text-2xl font-semibold text-foreground">Dojo Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground text-balance">
            Sistema de gestão de atividades de judô
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {erro && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <Campo>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErro("")
                }}
                placeholder="professor@dojo.com"
              />
            </Campo>

            <Campo>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  setErro("")
                }}
                placeholder="••••••••"
              />
            </Campo>

            <Button type="submit" size="lg" className="w-full">
              Entrar
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        <p className="mt-6 rounded-lg bg-accent/60 px-3 py-2.5 text-center text-xs text-muted-foreground">
          Acesso de demonstração: <strong className="text-foreground">professor@dojo.com</strong> /{" "}
          <strong className="text-foreground">judo123</strong>
        </p>
      </div>
    </main>
  )
}
