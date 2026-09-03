"""A unica camada que sabe escrever SQL sobre atividades.

A conexao e o esquema NAO estao aqui: moram em `app/database.py`,
porque sao do projeto inteiro. Aqui ficam so' as consultas desta
funcionalidade.
"""

from ..database import conectar


class Atividade:
    """O que sai do repositorio: um objeto, nunca a linha crua do banco."""

    def __init__(
        self,
        id,
        tipo,
        titulo,
        data,
        local=None,
        descricao=None
    ):
        self.id = id
        self.tipo = tipo
        self.titulo = titulo
        self.data = data
        self.local = local
        self.descricao = descricao


class RepositorioSQLite:
    """Recebe o caminho do banco."""

    def __init__(self, banco):
        self.banco = banco

    def buscar_atividade(self, atividade_id):
        conn = conectar(self.banco)
        try:
            linha = conn.execute(
                """
                SELECT id, tipo, titulo, data, local, descricao
                FROM atividades
                WHERE id = ?
                """,
                (atividade_id,),
            ).fetchone()
        finally:
            conn.close()

        if linha is None:
            return None

        return Atividade(
            linha["id"],
            linha["tipo"],
            linha["titulo"],
            linha["data"],
            linha["local"],
            linha["descricao"]
        )

    def registrar(
        self,
        tipo,
        titulo,
        data,
        local=None,
        descricao=None
    ):
        conn = conectar(self.banco)
        try:
            cursor = conn.execute(
                """
                INSERT INTO atividades
                (tipo, titulo, data, local, descricao)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    tipo,
                    titulo,
                    data,
                    local,
                    descricao
                ),
            )

            conn.commit()
            novo_id = cursor.lastrowid

        finally:
            conn.close()

        return {
            "id": novo_id,
            "tipo": tipo,
            "titulo": titulo,
            "data": data,
            "local": local,
            "descricao": descricao
        }