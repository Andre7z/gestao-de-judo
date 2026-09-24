import pytest

from app.atividades.erros import TipoDeAtividadeDesconhecido
from app.atividades.politicas import (
    RelatorioEntregaKimono,
    RelatorioFactory,
    RelatorioFrequencia,
    RelatorioTrocaDeFaixa,
)


def test_factory_cria_estrategia_correta():
    assert isinstance(RelatorioFactory.criar("troca_de_faixa"), RelatorioTrocaDeFaixa)
    assert isinstance(RelatorioFactory.criar("entrega_de_kimono"), RelatorioEntregaKimono)
    assert isinstance(RelatorioFactory.criar("frequencia"), RelatorioFrequencia)


def test_factory_lanca_erro_para_tipo_desconhecido():
    with pytest.raises(TipoDeAtividadeDesconhecido):
        RelatorioFactory.criar("tipo_inexistente")
