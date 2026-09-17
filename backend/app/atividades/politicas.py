class EstrategiaRelatorio:
    def gerar(self, atividade):
        raise NotImplementedError


class RelatorioTrocaDeFaixa(EstrategiaRelatorio):
    def gerar(self, atividade):
        return {
            "aluno": atividade.aluno.nome,
            "faixa_atual": atividade.aluno.faixa,
            "nova_faixa": atividade.nova_faixa,
            "tamanho_faixa": atividade.aluno.tamanho_faixa,
        }


class RelatorioEntregaKimono(EstrategiaRelatorio):
    def gerar(self, atividade):
        return {
            "aluno": atividade.aluno.nome,
            "turma": atividade.aluno.turma,
            "tamanho_kimono": atividade.aluno.tamanho_kimono,
        }


class RelatorioFrequencia(EstrategiaRelatorio):
    def gerar(self, atividade):
        return {
            "aluno": atividade.aluno.nome,
            "presenca": atividade.presenca,
            "data": atividade.data,
        }


ESTRATEGIAS_RELATORIO = {
    "troca_de_faixa": RelatorioTrocaDeFaixa(),
    "entrega_de_kimono": RelatorioEntregaKimono(),
    "frequencia": RelatorioFrequencia(),
}


def estrategia_para(tipo_atividade):
    if tipo_atividade not in ESTRATEGIAS_RELATORIO:
        raise ValueError(
            f"Tipo de atividade desconhecido: {tipo_atividade!r}"
        )

    return ESTRATEGIAS_RELATORIO[tipo_atividade]