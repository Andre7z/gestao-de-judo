from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Atividade(Base):
    __tablename__ = "atividades"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    nome = Column(String(120), nullable=False)
    data = Column(Date, nullable=False)
    local = Column(String(120), nullable=True)
    descricao = Column(String(500), nullable=True)

    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=True)
    nova_faixa = Column(String(120), nullable=True)
    presenca = Column(Boolean, nullable=True)

    aluno = relationship("Aluno")