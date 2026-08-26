from fastapi import APIRouter, HTTPException, status
from .schemas import AlunoCriar, AlunoPublico, AlunoAtualizar

router = APIRouter(prefix="/alunos", tags=["Alunos"])

# Banco de mentira: uma lista em memoria. Vira banco de verdade no encontro 4.
alunos: list[dict] = []


@router.get("/", response_model=list[AlunoPublico])
def listar():
    return alunos

@router.post("/", response_model=AlunoPublico, status_code=201)
def criar(dados: AlunoCriar):
    novo = {"id": len(alunos) + 1, **dados.model_dump()}
    alunos.append(novo)
    return novo

@router.get("/{alunos_id}", response_model=AlunoPublico)
def buscar(alunos_id: int):
    for p in alunos:
        if p["id"] == alunos_id:
            return p
    raise HTTPException(status_code=404, detail="Aluno nao encontrado")

@router.patch("/{aluno_id}", response_model=AlunoPublico)
def atualizar(aluno_id: int, dados: AlunoAtualizar):
    for a in alunos:
        if a["id"] == aluno_id:
            a.update(dados.model_dump(exclude_unset=True))
            return a
    raise HTTPException(status_code=404, detail="aluno nao encontrado")

@router.delete("/{aluno_id}", status_code=204)
def apagar(aluno_id: int):
    for a in alunos:
        if a["id"] == aluno_id:
            alunos.remove(a)
            return
    raise HTTPException(status_code=404, detail="Aluno nao encontrado")
