export type CategoriaAnexo =
  | "Documento"
  | "Regulamento"
  | "Autorização"
  | "Financeiro"
  | "Federação"
  | "Outro"

export const CATEGORIAS_ANEXO: CategoriaAnexo[] = [
  "Documento",
  "Regulamento",
  "Autorização",
  "Financeiro",
  "Federação",
  "Outro",
]

export type Anexo = {
  id: string
  titulo: string
  categoria: CategoriaAnexo
  descricao: string
  // Nome do arquivo enviado (opcional)
  nomeArquivo: string
  // URL de objeto criada no navegador para o arquivo enviado (opcional, válida na sessão)
  arquivoUrl: string
  // Link externo opcional (Google Drive, etc.)
  link: string
  criadoEm: string // ISO "YYYY-MM-DD"
}

export type NovoAnexo = Omit<Anexo, "id" | "criadoEm">

export const CATEGORIA_ESTILO: Record<CategoriaAnexo, string> = {
  Documento: "bg-blue-100 text-blue-800 border border-blue-200",
  Regulamento: "bg-purple-100 text-purple-800 border border-purple-200",
  Autorização: "bg-green-100 text-green-800 border border-green-200",
  Financeiro: "bg-amber-100 text-amber-800 border border-amber-200",
  Federação: "bg-rose-100 text-rose-800 border border-rose-200",
  Outro: "bg-muted text-foreground border border-border",
}
