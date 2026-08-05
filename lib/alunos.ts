export type Aluno = {
  id: string
  nome_aluno: string
  cpf: string
  faixa: string
  turma: string
  tamanho_kimono: string
  tamanho_faixa: string
  codigo_zempo: string
}

// Opções fixas usadas nos selects/filtros
export const FAIXAS = [
  "Branca",
  "Cinza",
  "Azul",
  "Amarela",
  "Laranja",
  "Verde",
  "Roxa",
  "Marrom",
  "Preta",
] as const

export const TURMAS = [
  "Infantil A",
  "Infantil B",
  "Juvenil",
  "Adulto",
  "Master",
] as const

export const TAMANHOS_KIMONO = ["M0", "M1", "M2", "M3", "A1", "A2", "A3", "A4"] as const
export const TAMANHOS_FAIXA = ["00", "0", "1", "2", "3", "4", "5", "6"] as const

// Dados de exemplo fixos (nenhum backend real)
export const ALUNOS_INICIAIS: Aluno[] = [
  {
    id: "1",
    nome_aluno: "Ana Beatriz Costa",
    cpf: "123.456.789-00",
    faixa: "Amarela",
    turma: "Infantil A",
    tamanho_kimono: "M2",
    tamanho_faixa: "1",
    codigo_zempo: "ZP-0001",
  },
  {
    id: "2",
    nome_aluno: "Bruno Henrique Lima",
    cpf: "234.567.890-11",
    faixa: "Verde",
    turma: "Juvenil",
    tamanho_kimono: "A1",
    tamanho_faixa: "3",
    codigo_zempo: "ZP-0002",
  },
  {
    id: "3",
    nome_aluno: "Carla Mendes Oliveira",
    cpf: "",
    faixa: "Roxa",
    turma: "Adulto",
    tamanho_kimono: "A2",
    tamanho_faixa: "4",
    codigo_zempo: "ZP-0003",
  },
  {
    id: "4",
    nome_aluno: "Diego Santos Ferreira",
    cpf: "345.678.901-22",
    faixa: "Preta",
    turma: "Master",
    tamanho_kimono: "A3",
    tamanho_faixa: "5",
    codigo_zempo: "ZP-0004",
  },
  {
    id: "5",
    nome_aluno: "Eduarda Rocha Nunes",
    cpf: "",
    faixa: "Branca",
    turma: "Infantil B",
    tamanho_kimono: "M1",
    tamanho_faixa: "0",
    codigo_zempo: "ZP-0005",
  },
  {
    id: "6",
    nome_aluno: "Felipe Araújo Souza",
    cpf: "456.789.012-33",
    faixa: "Azul",
    turma: "Adulto",
    tamanho_kimono: "A2",
    tamanho_faixa: "4",
    codigo_zempo: "ZP-0006",
  },
]

// Mapa de cores para exibir a faixa como um selo visual
export const FAIXA_ESTILO: Record<string, string> = {
  Branca: "bg-muted text-foreground border border-border",
  Cinza: "bg-neutral-200 text-neutral-800 border border-neutral-300",
  Azul: "bg-blue-100 text-blue-800 border border-blue-200",
  Amarela: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  Laranja: "bg-orange-100 text-orange-800 border border-orange-200",
  Verde: "bg-green-100 text-green-800 border border-green-200",
  Roxa: "bg-purple-100 text-purple-800 border border-purple-200",
  Marrom: "bg-amber-200 text-amber-900 border border-amber-300",
  Preta: "bg-neutral-900 text-white border border-neutral-900",
}
