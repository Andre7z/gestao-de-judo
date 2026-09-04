class ErroAluno(Exception):
    """Qualquer erro que envolve Aluno."""


class AlunoNaoEncontrado(ErroAluno):
    """Aluno nao existe."""

class CampoNaoEditavel(ErroAluno):
    """Tentaram editar pelo catalogo um campo que nao e do catalogo."""


