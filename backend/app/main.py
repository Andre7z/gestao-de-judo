from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .alunos import controller as alunos_controller
from .alunos.erros import ErroAluno, AlunoNaoEncontrado

from .atividades import controller as atividades_controller
from .atividades.erros import ErroAtividade, AtividadeNaoEncontrada

from .usuarios import controller as usuarios_controller
from .usuarios.erros import CredenciaisInvalidas, ErroDeUsuario


# Nao ha' mais create_all aqui. Quem cria -- e MUDA -- tabelas agora e'
# o Alembic: poetry run alembic upgrade head
# Uma vez ao clonar o projeto, e de novo a cada migracao nova.

app = FastAPI(title="API do Meu Projeto", version="0.4.0")

app.include_router(usuarios_controller.router)
app.include_router(alunos_controller.router)
app.include_router(atividades_controller.router)


@app.exception_handler(ErroAluno)
def traduzir_recusa(request: Request, erro: ErroAluno):
    """O unico lugar do sistema que transforma recusa em numero HTTP."""
    codigo = 404 if isinstance(erro, AlunoNaoEncontrado) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})


@app.exception_handler(ErroAtividade)
def traduzir_recusa_de_atividade(request: Request, erro: ErroAtividade):
    codigo = 404 if isinstance(erro, AtividadeNaoEncontrada) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})


@app.exception_handler(ErroDeUsuario)
def traduzir_recusa_de_usuario(request: Request, erro: ErroDeUsuario):
    if isinstance(erro, CredenciaisInvalidas):
        # 401 e' "nao sei quem voce e'". O cabecalho diz como se apresentar.
        return JSONResponse(
            status_code=401,
            content={"detail": str(erro)},
            headers={"WWW-Authenticate": "Bearer"},
        )
    return JSONResponse(status_code=409, content={"detail": str(erro)})