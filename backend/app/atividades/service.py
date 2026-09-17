"""As regras das atividades, e mais nada.

Este arquivo decide. Ele nao levanta erro de protocolo, nao monta consulta
e nao abre conexao: quem fala HTTP e o controller, quem fala SQL e o
repository.

O `db` atravessa este arquivo sem ser aberto: o Service so o repassa para
o repository, que e quem sabe o que fazer com ele.
"""

from . import repository
from .erros import AtividadeNaoEncontrada
from .politicas import estrategia_para


def listar(db):
    return repository.listar(db)


def buscar(db, atividade_id):
    atividade = repository.buscar(db, atividade_id)

    if atividade is None:
        raise AtividadeNaoEncontrada(
            f"Atividade {atividade_id} nao esta cadastrada"
        )

    return atividade


def criar(db, dados):
    return repository.criar(db, dados)


def atualizar(db, atividade_id, mudancas):
    atividade = buscar(db, atividade_id)

    return repository.atualizar(
        db,
        atividade,
        mudancas
    )


def apagar(db, atividade_id):
    atividade = buscar(db, atividade_id)

    repository.apagar(db, atividade)
    
def gerar_relatorio(db, atividade_id):
    atividade = buscar(db, atividade_id)

    estrategia = estrategia_para(atividade.tipo)

    return estrategia.gerar(atividade)