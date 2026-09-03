class ErroDeAtividade(Exception):
    """Qualquer erro relacionado a uma atividade."""


class AtividadeNaoEncontrada(ErroDeAtividade):
    """A atividade solicitada nao existe."""