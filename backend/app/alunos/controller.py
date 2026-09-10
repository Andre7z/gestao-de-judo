from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from . import service
from .schemas import AlunoAtualizar, AlunoCriar, AlunoPublico

router = APIRouter(prefix="/aluno", tags=["Aluno"])

# Nenhum `if` de regra e nenhum `try` aqui: as recusas do Service viram
# HTTP no tradutor registrado no main.py, uma vez para todas as rotas.


@router.get("/", response_model=list[AlunoPublico])
def listar(db: Session = Depends(get_db)):
    return service.listar(db)


@router.post("/", response_model=AlunoPublico, status_code=201)
def criar(dados: AlunoCriar, db: Session = Depends(get_db)):
    return service.criar(db, dados.model_dump())


@router.get("/{aluno_id}", response_model=AlunoPublico)
def buscar(aluno_id: int, db: Session = Depends(get_db)):
    return service.buscar(db, aluno_id)


@router.patch("/{aluno_id}", response_model=AlunoPublico)
def atualizar(
    aluno_id: int,
    dados: AlunoAtualizar,
    db: Session = Depends(get_db),
):
    return service.atualizar(db, aluno_id, dados.model_dump(exclude_unset=True))


@router.delete("/{aluno_id}", status_code=204)
def apagar(aluno_id: int, db: Session = Depends(get_db)):
    service.apagar(db, aluno_id)
