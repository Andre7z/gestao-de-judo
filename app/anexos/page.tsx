"use client"

import { useMemo, useRef, useState, type FormEvent } from "react"
import { Plus, Paperclip, X, Trash2, Download, ExternalLink, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Campo, ErroCampo, Input, Label, Select } from "@/components/form-controls"
import { useApp } from "@/components/app-provider"
import {
  CATEGORIAS_ANEXO,
  CATEGORIA_ESTILO,
  type CategoriaAnexo,
  type NovoAnexo,
} from "@/lib/anexos"
import { formatarData } from "@/lib/atividades"
import { cn } from "@/lib/utils"

export default function AnexosPage() {
  const { anexos, criarAnexo, excluirAnexo } = useApp()
  const [aberto, setAberto] = useState(false)
  const [filtro, setFiltro] = useState<"" | CategoriaAnexo>("")

  const filtrados = useMemo(
    () => (filtro ? anexos.filter((a) => a.categoria === filtro) : anexos),
    [anexos, filtro],
  )

  const vazio = anexos.length === 0

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Anexos importantes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Documentos, regulamentos e arquivos da academia
          </p>
        </div>
        <Button size="lg" onClick={() => setAberto(true)}>
          <Plus />
          Novo anexo
        </Button>
      </div>

      {!vazio && (
        <div className="mb-6">
          <Select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as "" | CategoriaAnexo)}
            aria-label="Filtrar por categoria"
            className="sm:w-64"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS_ANEXO.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      )}

      {vazio ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Paperclip className="size-6" />
          </span>
          <h2 className="text-lg font-medium text-foreground">Nenhum anexo ainda</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground text-balance">
            Guarde aqui documentos importantes como regulamentos, autorizações e comprovantes.
          </p>
          <Button size="lg" className="mt-6" onClick={() => setAberto(true)}>
            <Plus />
            Adicionar primeiro anexo
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtrados.map((anexo) => (
            <li
              key={anexo.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    CATEGORIA_ESTILO[anexo.categoria],
                  )}
                >
                  {anexo.categoria}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => excluirAnexo(anexo.id)}
                  aria-label={`Excluir ${anexo.titulo}`}
                >
                  <Trash2 />
                </Button>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground text-pretty">{anexo.titulo}</h3>
                  {anexo.descricao && (
                    <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                      {anexo.descricao}
                    </p>
                  )}
                  {anexo.nomeArquivo && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{anexo.nomeArquivo}</p>
                  )}
                </div>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">
                  Adicionado em {formatarData(anexo.criadoEm)}
                </span>
                <div className="ml-auto flex gap-2">
                  {anexo.arquivoUrl && (
                    <a
                      href={anexo.arquivoUrl}
                      download={anexo.nomeArquivo || anexo.titulo}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Download className="size-4" />
                      Baixar
                    </a>
                  )}
                  {anexo.link && (
                    <a
                      href={anexo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" />
                      Abrir link
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {aberto && (
        <ModalNovoAnexo
          onFechar={() => setAberto(false)}
          onSalvar={(dados) => {
            criarAnexo(dados)
            setAberto(false)
          }}
        />
      )}
    </div>
  )
}

function ModalNovoAnexo({
  onFechar,
  onSalvar,
}: {
  onFechar: () => void
  onSalvar: (dados: NovoAnexo) => void
}) {
  const inputArquivo = useRef<HTMLInputElement>(null)
  const [titulo, setTitulo] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAnexo>("Documento")
  const [descricao, setDescricao] = useState("")
  const [link, setLink] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("")
  const [arquivoUrl, setArquivoUrl] = useState("")
  const [erro, setErro] = useState("")

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setNomeArquivo(arquivo.name)
    // Cria uma URL de objeto válida durante a sessão do navegador
    setArquivoUrl(URL.createObjectURL(arquivo))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!titulo.trim()) {
      setErro("Informe um título para o anexo.")
      return
    }
    onSalvar({
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      link: link.trim(),
      nomeArquivo,
      arquivoUrl,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-anexo"
      onClick={onFechar}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 id="titulo-anexo" className="text-base font-semibold text-foreground">
            Novo anexo
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onFechar} aria-label="Fechar">
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex-1 space-y-4 overflow-y-auto p-4">
          <Campo>
            <Label htmlFor="titulo-campo" obrigatorio>
              Título
            </Label>
            <Input
              id="titulo-campo"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value)
                setErro("")
              }}
              placeholder="Ex.: Regulamento interno 2025"
              aria-invalid={!!erro}
            />
            <ErroCampo>{erro}</ErroCampo>
          </Campo>

          <Campo>
            <Label htmlFor="categoria-campo">Categoria</Label>
            <Select
              id="categoria-campo"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaAnexo)}
            >
              {CATEGORIAS_ANEXO.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Campo>

          <Campo>
            <Label htmlFor="descricao-campo">Descrição</Label>
            <textarea
              id="descricao-campo"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Observações sobre o documento..."
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/30"
            />
          </Campo>

          <Campo>
            <Label htmlFor="link-campo">Link externo (opcional)</Label>
            <Input
              id="link-campo"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </Campo>

          <Campo>
            <Label>Arquivo (opcional)</Label>
            <input
              ref={inputArquivo}
              type="file"
              onChange={handleArquivo}
              className="sr-only"
              aria-label="Selecionar arquivo"
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-start"
              onClick={() => inputArquivo.current?.click()}
            >
              <Upload />
              {nomeArquivo || "Selecionar arquivo"}
            </Button>
          </Campo>
        </form>

        <div className="flex flex-col-reverse gap-3 border-t border-border p-4 sm:flex-row sm:justify-end">
          <Button variant="outline" size="lg" onClick={onFechar}>
            Cancelar
          </Button>
          <Button size="lg" onClick={handleSubmit}>
            Salvar anexo
          </Button>
        </div>
      </div>
    </div>
  )
}
