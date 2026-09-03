from .erros import AtividadeNaoEncontrada


class AtividadeService:

    def __init__(self, repositorio):
        # Nao e a sessao do banco: e qualquer coisa que saiba buscar e salvar.
        self.repositorio = repositorio

    def criar(
        self,
        tipo,
        titulo,
        data,
        local=None,
        descricao=None
    ):
        atividade = self.repositorio.registrar(
            tipo,
            titulo,
            data,
            local,
            descricao
        )

        return atividade