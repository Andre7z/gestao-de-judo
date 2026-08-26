from pydantic import BaseModel, Field


class AlunoCriar(BaseModel):
    nome: str = Field(min_length=2)
    cpf: str = Field(min_length=11)
    faixa: str = Field(min_length=2)
    turma: str = Field(min_length=2)
    tamanho_kimono: str = Field(min_length=2)
    tamanho_faixa: str = Field(min_length=2)
    codigo_zempo: str = Field(min_length=2)
    
class AlunoPublico(BaseModel):
    nome: str 
    cpf: str 
    faixa: str 
    turma: str 
    tamanho_kimono: str 
    tamanho_faixa: str
    codigo_zempo: str 
    
class AlunoAtualizar(BaseModel):
    nome: str | None = None
    cpf: str | None = None
    faixa: str | None = None
    turma: str | None = None
    tamanho_kimono: str | None = None
    tamanho_faixa: str | None = None
    codigo_zempo: str | None = None
    