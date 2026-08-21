from fastapi import FastAPI
from .alunos import controller as alunos_controller

app = FastAPI(title="API do Meu Projeto", version="0.1.0")
app.include_router(alunos_controller.router)
