from pydantic import BaseModel


class AtividadeEntrada(BaseModel):  # ENTRA no pedido

    tipo: str
    titulo: str
    data: str
    local: str | None = None
    descricao: str | None = None


class AtividadePublico(BaseModel):  # SAI na resposta

    id: int
    tipo: str
    titulo: str
    data: str
    local: str | None = None
    descricao: str | None = None