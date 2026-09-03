from .erros import AlunoNaoEncontrado

class AlunoService:
    def __init__(self, repositorio):
        # Nao e a sessao do banco: e qualquer coisa que saiba buscar e salvar.
        self.repositorio = repositorio

    def listar(self):
        return self.repositorio.listar_alunos()

    def buscar(self, aluno_id):
        aluno = self.repositorio.buscar_aluno(aluno_id)
        if aluno is None:
            raise AlunoNaoEncontrado(
                f"Aluno {aluno_id} nao encontrado"
            )
        return aluno

    def criar(
        self,
        nome,
        cpf,
        faixa,
        turma,
        tamanho_kimono,
        tamanho_faixa,
        codigo_zempo
    ):
        return self.repositorio.registrar(
            nome,
            cpf,
            faixa,
            turma,
            tamanho_kimono,
            tamanho_faixa,
            codigo_zempo
        )