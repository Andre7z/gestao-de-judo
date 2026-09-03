from fastapi import APIRouter, Depends, HTTPException

from .dependencias import obter_service
from .erros import AlunoNaoEncontrado
from .schemas import AlunoCriar, AlunoPublico, AlunoAtualizar
from .service import AlunoService

router = APIRouter(prefix="/alunos", tags=["Alunos"])


@router.get("/{aluno_id}", response_model=AlunoPublico)
def buscar_aluno(
    aluno_id: int,
    service: AlunoService = Depends(obter_service),
):
    try:
        return service.buscar(aluno_id)
    except AlunoNaoEncontrado as erro:
        raise HTTPException(status_code=404, detail=str(erro))


@router.post("/", response_model=AlunoPublico, status_code=201)
def criar_aluno(
    dados: AlunoCriar,
    service: AlunoService = Depends(obter_service),
):
    return service.criar(
        dados.nome,
        dados.cpf,
        dados.faixa,
        dados.turma,
        dados.tamanho_kimono,
        dados.tamanho_faixa,
        dados.codigo_zempo,
    )

@router.get("/", response_model=list[AlunoPublico])
def listar_alunos(
    service: AlunoService = Depends(obter_service),
):
    return service.listar()