"""As estrategias de relatorio: o padrao Strategy dentro das atividades.

Cada tipo de atividade tem um jeito proprio de gerar seu relatorio.
Aqui cada jeito vira um objeto, e todos respondem a MESMA pergunta:
como gerar o relatorio da atividade.

O Service recebe uma estrategia e pergunta como gerar o relatorio.
Ele nao precisa saber qual tipo de atividade esta sendo tratado.

A pergunta "que tipo de atividade e'?" existe no sistema inteiro uma vez so':
na fabrica abaixo.
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


class RelatorioFactory:
    """Cria a estrategia correta conforme o tipo de atividade."""

    @staticmethod
    def criar(tipo_atividade):
        estrategias = {
            "troca_de_faixa": RelatorioTrocaDeFaixa(),
            "entrega_de_kimono": RelatorioEntregaKimono(),
            "frequencia": RelatorioFrequencia(),
        }

        if tipo_atividade not in estrategias:
            aceitos = ", ".join(estrategias)
            raise TipoDeAtividadeDesconhecido(
                f"Tipo de atividade desconhecido: {tipo_atividade!r} "
                f"(aceitos: {aceitos})"
            )

        return estrategias[tipo_atividade]


def estrategia_para(tipo_atividade):
    """Compatibilidade com o codigo antigo: delega para a fabrica."""
    return RelatorioFactory.criar(tipo_atividade)