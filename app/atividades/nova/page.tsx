"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Campo, ErroCampo, Input, Label, Select } from "@/components/form-controls"
import { useApp } from "@/components/app-provider"
import {
  TIPOS_ATIVIDADE,
  TIPOS_ATIVIDADE_ORDEM,
  dataHojeISO,
  type NovaAtividade,
  type TipoAtividade,
} from "@/lib/atividades"

export default function NovaAtividadePage() {
  const router = useRouter()
  const { criarAtividade } = useApp()

  const [form, setForm] = useState<NovaAtividade>({
    tipo: "presenca",
    titulo: "",
    data: dataHojeISO(),
    local: "",
    descricao: "",
  })
  const [erros, setErros] = useState<{ titulo?: string; data?: string }>({})

  function atualizar<K extends keyof NovaAtividade>(campo: K, valor: NovaAtividade[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const novosErros: typeof erros = {}
    if (!form.titulo.trim()) novosErros.titulo = "Informe um título para a atividade."
    if (!form.data) novosErros.data = "Selecione a data da atividade."
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    const nova = criarAtividade({ ...form, titulo: form.titulo.trim() })
    router.push(`/atividades/${nova.id}`)
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

      <h1 className="mb-1 text-2xl font-semibold text-foreground">Nova atividade</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Escolha o tipo e preencha os dados. Depois você adiciona os alunos participantes.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Campo>
            <Label htmlFor="tipo" obrigatorio>
              Tipo de atividade
            </Label>
            <Select
              id="tipo"
              value={form.tipo}
              onChange={(e) => atualizar("tipo", e.target.value as TipoAtividade)}
            >
              {TIPOS_ATIVIDADE_ORDEM.map((t) => (
                <option key={t} value={t}>
                  {TIPOS_ATIVIDADE[t].rotulo}
                </option>
              ))}
            </Select>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {TIPOS_ATIVIDADE[form.tipo].descricao}
            </p>
          </Campo>

          <Campo>
            <Label htmlFor="titulo" obrigatorio>
              Título
            </Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(e) => atualizar("titulo", e.target.value)}
              placeholder="Ex.: Treino de terça — Infantil"
              aria-invalid={!!erros.titulo}
            />
            <ErroCampo>{erros.titulo}</ErroCampo>
          </Campo>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo>
              <Label htmlFor="data" obrigatorio>
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={form.data}
                onChange={(e) => atualizar("data", e.target.value)}
                aria-invalid={!!erros.data}
              />
              <ErroCampo>{erros.data}</ErroCampo>
            </Campo>

            <Campo>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={form.local}
                onChange={(e) => atualizar("local", e.target.value)}
                placeholder="Ex.: Tatame principal"
              />
            </Campo>
          </div>

          <Campo>
            <Label htmlFor="descricao">Descrição</Label>
            <textarea
              id="descricao"
              value={form.descricao}
              onChange={(e) => atualizar("descricao", e.target.value)}
              placeholder="Observações gerais sobre a atividade..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/30"
            />
          </Campo>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" size="lg">
              Criar e adicionar alunos
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
