"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Campo, ErroCampo, Input, Label, Select } from "@/components/form-controls"
import { FAIXAS, TURMAS, TAMANHOS_KIMONO, TAMANHOS_FAIXA, type Aluno } from "@/lib/alunos"

type DadosAluno = Omit<Aluno, "id">

type Erros = Partial<Record<keyof DadosAluno, string>>

export function AlunoForm({
  inicial,
  onSubmit,
  textoBotao,
}: {
  inicial?: Aluno
  onSubmit: (dados: DadosAluno) => void
  textoBotao: string
}) {
  const router = useRouter()
  const [form, setForm] = useState<DadosAluno>({
    nome_aluno: inicial?.nome_aluno ?? "",
    cpf: inicial?.cpf ?? "",
    faixa: inicial?.faixa ?? "",
    turma: inicial?.turma ?? "",
    tamanho_kimono: inicial?.tamanho_kimono ?? "",
    tamanho_faixa: inicial?.tamanho_faixa ?? "",
    codigo_zempo: inicial?.codigo_zempo ?? "",
  })
  const [erros, setErros] = useState<Erros>({})

  function atualizar(campo: keyof DadosAluno, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function validar(dados: DadosAluno): Erros {
    const e: Erros = {}
    if (!dados.nome_aluno.trim()) e.nome_aluno = "O nome do aluno é obrigatório."
    if (!dados.faixa) e.faixa = "Selecione a faixa do aluno."
    if (!dados.turma) e.turma = "Selecione a turma do aluno."
    return e
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const novosErros = validar(form)
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    onSubmit({ ...form, nome_aluno: form.nome_aluno.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Campo>
        <Label htmlFor="nome_aluno" obrigatorio>
          Nome do aluno
        </Label>
        <Input
          id="nome_aluno"
          value={form.nome_aluno}
          onChange={(e) => atualizar("nome_aluno", e.target.value)}
          placeholder="Ex.: Ana Beatriz Costa"
          aria-invalid={!!erros.nome_aluno}
          aria-describedby={erros.nome_aluno ? "erro-nome" : undefined}
        />
        <span id="erro-nome">
          <ErroCampo>{erros.nome_aluno}</ErroCampo>
        </span>
      </Campo>

      <Campo>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={form.cpf}
          onChange={(e) => atualizar("cpf", e.target.value)}
          placeholder="000.000.000-00"
          inputMode="numeric"
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo>
          <Label htmlFor="faixa" obrigatorio>
            Faixa
          </Label>
          <Select
            id="faixa"
            value={form.faixa}
            onChange={(e) => atualizar("faixa", e.target.value)}
            aria-invalid={!!erros.faixa}
          >
            <option value="">Selecione...</option>
            {FAIXAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
          <ErroCampo>{erros.faixa}</ErroCampo>
        </Campo>

        <Campo>
          <Label htmlFor="turma" obrigatorio>
            Turma
          </Label>
          <Select
            id="turma"
            value={form.turma}
            onChange={(e) => atualizar("turma", e.target.value)}
            aria-invalid={!!erros.turma}
          >
            <option value="">Selecione...</option>
            {TURMAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <ErroCampo>{erros.turma}</ErroCampo>
        </Campo>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo>
          <Label htmlFor="tamanho_kimono">Tamanho do kimono</Label>
          <Select
            id="tamanho_kimono"
            value={form.tamanho_kimono}
            onChange={(e) => atualizar("tamanho_kimono", e.target.value)}
          >
            <option value="">Selecione...</option>
            {TAMANHOS_KIMONO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Campo>

        <Campo>
          <Label htmlFor="tamanho_faixa">Tamanho da faixa</Label>
          <Select
            id="tamanho_faixa"
            value={form.tamanho_faixa}
            onChange={(e) => atualizar("tamanho_faixa", e.target.value)}
          >
            <option value="">Selecione...</option>
            {TAMANHOS_FAIXA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Campo>
      </div>

      <Campo>
        <Label htmlFor="codigo_zempo">Código Zempo</Label>
        <Input
          id="codigo_zempo"
          value={form.codigo_zempo}
          onChange={(e) => atualizar("codigo_zempo", e.target.value)}
          placeholder="Ex.: ZP-0001"
        />
      </Campo>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" size="lg">
          {textoBotao}
        </Button>
      </div>
    </form>
  )
}
