from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .database import Base, engine
from .alunos import controller as alunos_controller
from .alunos.erros import ErroAluno, AlunoNaoEncontrado

# So' para a aula: cria as tabelas ao subir. Em projeto de verdade quem
# faz isso e' uma ferramenta de migracao (Alembic), assunto de outro dia.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API do Meu Projeto", version="0.3.0")
app.include_router(alunos_controller.router)


@app.exception_handler(ErroAluno)
def traduzir_recusa(request: Request, erro: ErroAluno):
    """O unico lugar do sistema que transforma recusa em numero HTTP."""
    codigo = 404 if isinstance(erro, AlunoNaoEncontrado) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})
