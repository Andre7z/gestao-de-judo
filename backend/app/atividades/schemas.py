from datetime import date

from pydantic import BaseModel, ConfigDict, field_validator


def _texto_legivel(texto, campo):
    if len(texto.strip()) < 2:
        raise ValueError(f"o {campo} precisa ter pelo menos 2 caracteres")
    return texto.strip()


class AtividadeEntrada(BaseModel):  # ENTRA no cadastro
    tipo: str
    nome: str
    data: date
    local: str | None = None
    descricao: str | None = None

    aluno_id: int | None = None
    nova_faixa: str | None = None
    presenca: bool | None = None

    @field_validator("tipo")
    @classmethod
    def tipo_legivel(cls, v):
        return _texto_legivel(v, "tipo")

    @field_validator("nome")
    @classmethod
    def nome_legivel(cls, v):
        return _texto_legivel(v, "nome")

    @field_validator("local")
    @classmethod
    def local_legivel(cls, v):
        return v if v is None else _texto_legivel(v, "local")

    @field_validator("descricao")
    @classmethod
    def descricao_legivel(cls, v):
        return v if v is None else v.strip()


class AtividadePublico(BaseModel):  # SAI na resposta
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    nome: str
    data: date
    local: str | None = None
    descricao: str | None = None

    aluno_id: int | None = None
    nova_faixa: str | None = None
    presenca: bool | None = None


class AtividadeAtualizar(BaseModel):  # ENTRA na edição, tudo opcional
    tipo: str | None = None
    nome: str | None = None
    data: date | None = None
    local: str | None = None
    descricao: str | None = None

    aluno_id: int | None = None
    nova_faixa: str | None = None
    presenca: bool | None = None

    @field_validator("tipo")
    @classmethod
    def tipo_legivel(cls, v):
        return v if v is None else _texto_legivel(v, "tipo")

    @field_validator("nome")
    @classmethod
    def nome_legivel(cls, v):
        return v if v is None else _texto_legivel(v, "nome")

    @field_validator("local")
    @classmethod
    def local_legivel(cls, v):
        return v if v is None else _texto_legivel(v, "local")

    @field_validator("descricao")
    @classmethod
    def descricao_legivel(cls, v):
        return v if v is None else v.strip()