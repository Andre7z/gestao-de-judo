from datetime import date
from pydantic import BaseModel

class AtividadeEntrada(BaseModel):
    tipo: str
    nome: str
    data: date
    local: str | None = None
    descricao: str | None = None

    aluno_id: int | None = None
    nova_faixa: str | None = None
    presenca: bool | None = None

class AtividadePublico(BaseModel):
    id: int
    tipo: str
    nome: str
    data: date
    local: str | None = None
    descricao: str | None = None

    aluno_id: int | None = None
    nova_faixa: str | None = None
    presenca: bool | None = None