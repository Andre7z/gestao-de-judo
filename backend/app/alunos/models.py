from sqlalchemy import Column, Date, Integer, String
from ..database import Base


class Aluno(Base):
    """A TABELA. Nao confunda com os schemas: aquilo atravessa a
    fronteira da API, isto vira linha no banco.
    """

    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    cpf = Column(String(14), nullable=True)
    data_nascimento = Column(Date, nullable=True)
    faixa = Column(String(120), nullable=False)
    turma = Column(String(120), nullable=False)
    tamanho_kimono = Column(String(5), nullable=True)
    tamanho_faixa = Column(String(5), nullable=True)
    codigo_zempo = Column(String(14), nullable=True)


@property
def idade(self):
    hoje = Date.today()

    idade = hoje.year - self.data_nascimento.year

    if (hoje.month, hoje.day) < (
        self.data_nascimento.month,
        self.data_nascimento.day
    ):
        idade -= 1

    return idade