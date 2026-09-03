from fastapi import FastAPI

from .database import BANCO, criar_banco

from .alunos.controller import router as alunos_router
from .atividades.controller import router as atividades_router

criar_banco(BANCO)  # uma vez, quando a aplicacao sobe

app = FastAPI(title="Zen'yo App", version="0.3.0")

app.include_router(alunos_router)
app.include_router(atividades_router)