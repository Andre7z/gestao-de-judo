// Tipos de atividade de judô
export type TipoAtividade = "presenca" | "kimono" | "faixa"

// Cada participante guarda um "instantâneo" dos dados do aluno no momento
// da atividade, além do status (presente / entregue / aprovado).
export type Participante = {
  alunoId: string
  nome: string
  turma: string
  // Faixa e tamanhos capturados na hora (podem mudar depois no cadastro do aluno)
  faixa: string
  tamanho_kimono: string
  tamanho_faixa: string
  // Significado do status varia conforme o tipo:
  // presenca -> presente | kimono -> entregue | faixa -> aprovado
  status: boolean
  observacao: string
}

export type Atividade = {
  id: string
  tipo: TipoAtividade
  titulo: string
  data: string // formato ISO "YYYY-MM-DD"
  local: string
  descricao: string
  participantes: Participante[]
}

export type NovaAtividade = Omit<Atividade, "id" | "participantes">

// Metadados de exibição de cada tipo de atividade
export const TIPOS_ATIVIDADE: Record<
  TipoAtividade,
  {
    rotulo: string
    descricao: string
    // Rótulo da coluna/ação de status
    rotuloStatus: string
    // Cor de destaque (classes utilitárias)
    estilo: string
  }
> = {
  presenca: {
    rotulo: "Controle de presença",
    descricao: "Marque quais alunos compareceram à atividade.",
    rotuloStatus: "Presente",
    estilo: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  kimono: {
    rotulo: "Entrega de kimono",
    descricao: "Acompanhe a entrega de kimonos com o tamanho de cada aluno.",
    rotuloStatus: "Entregue",
    estilo: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  faixa: {
    rotulo: "Exame de faixa",
    descricao: "Registre o exame de faixa com a cor e o tamanho de faixa.",
    rotuloStatus: "Aprovado",
    estilo: "bg-purple-100 text-purple-800 border border-purple-200",
  },
}

// Ordem usada nos seletores
export const TIPOS_ATIVIDADE_ORDEM: TipoAtividade[] = ["presenca", "kimono", "faixa"]

// Formata "YYYY-MM-DD" para "DD/MM/AAAA" sem depender de fuso horário
export function formatarData(iso: string): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.split("-")
  if (!ano || !mes || !dia) return iso
  return `${dia}/${mes}/${ano}`
}

// Retorna a data de hoje em formato "YYYY-MM-DD" (horário local)
export function dataHojeISO(): string {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, "0")
  const dia = String(hoje.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

// Resumo de status: quantos "true" de um total
export function resumoStatus(atividade: Atividade) {
  const total = atividade.participantes.length
  const confirmados = atividade.participantes.filter((p) => p.status).length
  return { total, confirmados }
}
