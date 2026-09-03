class ErroAnluno(Exception):
    """Qualquer erro que envolve Aluno."""


class AlunoNaoEncontrado(ErroAnluno):
    """Aluno nao existe."""

