from ..database import BANCO
from .repositorio import RepositorioSQLite
from .service import AtividadeService


def obter_service():
    """Monta o Service ja com o repositorio de producao dentro.

    Este e o unico arquivo do sistema que escolhe QUAL repositorio o Service
    vai usar. Trocar de banco e' trocar a classe que aparece nesta linha.
    """
    return AtividadeService(RepositorioSQLite(BANCO))
