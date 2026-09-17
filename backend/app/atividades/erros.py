class ErroAtividade(Exception):
    """Qualquer erro que envolve Atividade."""


class AtividadeNaoEncontrada(ErroAtividade):
    """Atividade nao existe."""

class CampoNaoEditavel(ErroAtividade):
    """Tentaram editar pelo catalogo um campo que nao e do catalogo."""