"""As estrategias de relatorio: o padrao Strategy dentro das atividades.

Cada tipo de atividade tem um jeito proprio de gerar seu relatorio.
Aqui cada jeito vira um objeto, e todos respondem a MESMA pergunta:
como gerar o relatorio da atividade.

O Service recebe uma estrategia e pergunta como gerar o relatorio.
Ele nao precisa saber qual tipo de atividade esta sendo tratado.

A pergunta "que tipo de atividade e'?" existe no sistema inteiro uma vez so':
em `estrategia_para`, no fim deste arquivo.
"""
from .erros import TipoDeAtividadeDesconhecido

class EstrategiaRelatorio:
    """O contrato: toda estrategia sabe gerar um relatorio."""

    def gerar(self, atividade):
        """Gera o relatorio da atividade."""
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


# O unico lugar do sistema que sabe quais tipos de atividade existem.
ESTRATEGIAS_RELATORIO = {
    "troca_de_faixa": RelatorioTrocaDeFaixa(),
    "entrega_de_kimono": RelatorioEntregaKimono(),
    "frequencia": RelatorioFrequencia(),
}

def estrategia_para(tipo_atividade):
    """Troca o nome do tipo pela estrategia dele. A escolha acontece aqui, e so' aqui."""
    if tipo_atividade not in ESTRATEGIAS_RELATORIO:
        aceitos = ", ".join(ESTRATEGIAS_RELATORIO)
        raise TipoDeAtividadeDesconhecido(
            f"Tipo de atividade desconhecido: {tipo_atividade!r} "
            f"(aceitos: {aceitos})"
        )

    return ESTRATEGIAS_RELATORIO[tipo_atividade]