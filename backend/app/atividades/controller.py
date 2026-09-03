from fastapi import APIRouter, Depends, HTTPException

from .dependencias import obter_service
from .schemas import AtividadeEntrada, AtividadePublico
from .service import AtividadeService

router = APIRouter(prefix="/atividades", tags=["Atividades"])


@router.post("/", status_code=201, response_model=AtividadePublico)
def criar_atividade(
    dados: AtividadeEntrada,
    service: AtividadeService = Depends(obter_service),
):
    return service.criar(
        dados.tipo,
        dados.titulo,
        dados.data,
        dados.local,
        dados.descricao,
    )