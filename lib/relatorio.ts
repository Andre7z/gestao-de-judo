import { TIPOS_ATIVIDADE, formatarData, resumoStatus, type Atividade } from "@/lib/atividades"

// Colunas específicas exibidas no relatório conforme o tipo de atividade
function colunasExtras(atividade: Atividade): { rotulo: string; valor: (p: Atividade["participantes"][number]) => string }[] {
  if (atividade.tipo === "kimono") {
    return [{ rotulo: "Tamanho do kimono", valor: (p) => p.tamanho_kimono || "—" }]
  }
  if (atividade.tipo === "faixa") {
    return [
      { rotulo: "Cor da faixa", valor: (p) => p.faixa || "—" },
      { rotulo: "Tamanho da faixa", valor: (p) => p.tamanho_faixa || "—" },
    ]
  }
  return []
}

function escaparCsv(valor: string): string {
  if (/[",\n;]/.test(valor)) return `"${valor.replace(/"/g, '""')}"`
  return valor
}

// Gera e baixa um arquivo CSV com os participantes da atividade
export function baixarRelatorioCsv(atividade: Atividade) {
  const meta = TIPOS_ATIVIDADE[atividade.tipo]
  const extras = colunasExtras(atividade)
  const cabecalho = ["Aluno", "Turma", ...extras.map((c) => c.rotulo), meta.rotuloStatus, "Observação"]

  const linhas = atividade.participantes.map((p) => [
    p.nome,
    p.turma,
    ...extras.map((c) => c.valor(p)),
    p.status ? "Sim" : "Não",
    p.observacao,
  ])

  const conteudo = [cabecalho, ...linhas]
    .map((linha) => linha.map((c) => escaparCsv(String(c))).join(","))
    .join("\n")

  // BOM para acentuação correta no Excel
  const blob = new Blob(["\uFEFF" + conteudo], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `relatorio-${atividade.titulo.toLowerCase().replace(/\s+/g, "-")}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Abre uma janela com o relatório formatado e dispara a impressão (permite salvar em PDF)
export function imprimirRelatorio(atividade: Atividade) {
  const meta = TIPOS_ATIVIDADE[atividade.tipo]
  const extras = colunasExtras(atividade)
  const { total, confirmados } = resumoStatus(atividade)

  const cabecalhoColunas = ["Aluno", "Turma", ...extras.map((c) => c.rotulo), meta.rotuloStatus, "Observação"]

  const linhas = atividade.participantes
    .map(
      (p) => `
        <tr>
          <td>${p.nome}</td>
          <td>${p.turma || "—"}</td>
          ${extras.map((c) => `<td>${c.valor(p)}</td>`).join("")}
          <td class="${p.status ? "sim" : "nao"}">${p.status ? "Sim" : "Não"}</td>
          <td>${p.observacao || "—"}</td>
        </tr>`,
    )
    .join("")

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório — ${atividade.titulo}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1a1a2e; margin: 40px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .tipo { display: inline-block; font-size: 12px; font-weight: 600; color: #3730a3; background: #eef2ff; padding: 3px 10px; border-radius: 999px; }
    .meta { color: #555; font-size: 13px; margin: 12px 0 4px; }
    .resumo { margin: 16px 0 20px; font-size: 14px; }
    .resumo strong { font-size: 18px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e2ea; }
    th { background: #f4f4f8; font-weight: 600; }
    td.sim { color: #15803d; font-weight: 600; }
    td.nao { color: #b91c1c; font-weight: 600; }
    footer { margin-top: 28px; font-size: 11px; color: #999; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <span class="tipo">${meta.rotulo}</span>
  <h1>${atividade.titulo}</h1>
  <div class="meta">Data: ${formatarData(atividade.data)}${atividade.local ? " &middot; Local: " + atividade.local : ""}</div>
  ${atividade.descricao ? `<div class="meta">${atividade.descricao}</div>` : ""}
  <div class="resumo"><strong>${confirmados}</strong> de <strong>${total}</strong> — ${meta.rotuloStatus.toLowerCase()}</div>
  <table>
    <thead><tr>${cabecalhoColunas.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${linhas || `<tr><td colspan="${cabecalhoColunas.length}">Nenhum aluno adicionado.</td></tr>`}</tbody>
  </table>
  <footer>Gerado pelo Zen'yo App em ${formatarData(new Date().toISOString().slice(0, 10))}</footer>
</body>
</html>`

  const janela = window.open("", "_blank")
  if (!janela) return
  janela.document.write(html)
  janela.document.close()
  janela.focus()
  // Pequeno atraso para garantir a renderização antes de imprimir
  setTimeout(() => janela.print(), 300)
}
