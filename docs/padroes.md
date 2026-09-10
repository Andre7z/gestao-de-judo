1. Injeção de Dependência
Que problema ele resolve?
Evita repetir o código de conexão do banco em cada rota. O FastAPI, usando o Depends, passa o banco para a rota usar.

O que aconteceria sem ele?
Cada rota teria que criar o Service. Assim, teria o mesmo código repetido várias vezes em várias rotas. Caso o banco mudasse, teria que mudar várias rotas.

no controller
@router.post("/", response_model=AlunoPublico, status_code=201)
def criar(dados: AlunoCriar, db: Session = Depends(get_db)):
    return service.criar(db, dados.model_dump())

no database
def get_db():
    """Uma sessao por requisicao, fechada mesmo se der erro."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

2. Corrente de Responsabilidade
Que problema ele resolve?
Centraliza o tratamento dos erros da aplicação, evitando que cada rota precise ter vários try/except para tratar os erros.

O que aconteceria sem ele?
O mesmo tratamento de erros teria que ser repetido em várias rotas. Se fosse necessário mudar algum erro, seria preciso alterar em vários lugares.

no erros
class ErroAluno(Exception):
    """Qualquer erro que envolve Aluno."""


class AlunoNaoEncontrado(ErroAluno):
    """Aluno nao existe."""

class CampoNaoEditavel(ErroAluno):
    """Tentaram editar pelo catalogo um campo que nao e do catalogo."""


no main
@app.exception_handler(ErroAluno)
def traduzir_recusa(request: Request, erro: ErroAluno):
    """O unico lugar do sistema que transforma recusa em numero HTTP."""
    codigo = 404 if isinstance(erro, AlunoNaoEncontrado) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})


3. Composite (include_router)
Que problema ele resolve?
Ajuda a organizar as rotas em grupos. Dessa maneira pode colocar várias rotas dentro de um router e depois adicionar esse grupo ao aplicativo usando include_router().

O que aconteceria sem ele?
As rotas ficariam todas no main.py. Conforme o projeto fosse crescendo, o arquivo ficaria muito grande e mais difícil de organizar.

no controller
router = APIRouter(prefix="/aluno", tags=["Aluno"])
@router.get("/")
def listar():

@router.post("/")
def criar():

@router.delete("/{aluno_id}")
def apagar():

no main
app.include_router(alunos_controller.router)

4. Unit of Work (Session + commit)
Que problema ele resolve?
Permite que a Session junte várias alterações no banco e salve tudo de uma vez usando o commit. Assim, em um commit, as mudanças são confirmadas no banco.

O que aconteceria sem ele?
As alterações poderiam ser salvas separadamente. Se uma alteração desse erro depois de outra já ter sido salvao, assim o banco poderia ficar com apenas parte das mudanças.

no database
SessionLocal = sessionmaker(bind=engine)

no repository
def criar(db: Session, dados: dict):
    aluno = Aluno(**dados)
    db.add(aluno)
    db.commit()
    db.refresh(aluno)
    return aluno

