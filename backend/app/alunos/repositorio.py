"""A unica camada que sabe escrever SQL sobre alunos.

A conexao e o esquema NAO estao aqui: moram em `app/database.py`,
porque sao do projeto inteiro. Aqui ficam so' as consultas desta
funcionalidade.
"""

from ..database import conectar


class Aluno:
    """O que sai do repositorio: um objeto, nunca a linha crua do banco."""

    def __init__(
        self,
        id,
        nome,
        cpf,
        faixa,
        turma,
        tamanho_kimono,
        tamanho_faixa,
        codigo_zempo
    ):
        self.id = id
        self.nome = nome
        self.cpf = cpf
        self.faixa = faixa
        self.turma = turma
        self.tamanho_kimono = tamanho_kimono
        self.tamanho_faixa = tamanho_faixa
        self.codigo_zempo = codigo_zempo


class RepositorioSQLite:
    """Recebe o caminho do banco."""

    def __init__(self, banco):
        self.banco = banco

    def buscar_aluno(self, aluno_id):
        conn = conectar(self.banco)
        try:
            linha = conn.execute(
                """
                SELECT id, nome, cpf, faixa, turma,
                       tamanho_kimono, tamanho_faixa, codigo_zempo
                FROM alunos
                WHERE id = ?
                """,
                (aluno_id,),
            ).fetchone()
        finally:
            conn.close()

        if linha is None:
            return None

        return Aluno(
            linha["id"],
            linha["nome"],
            linha["cpf"],
            linha["faixa"],
            linha["turma"],
            linha["tamanho_kimono"],
            linha["tamanho_faixa"],
            linha["codigo_zempo"]
        )

    def registrar(
        self,
        nome,
        cpf,
        faixa,
        turma,
        tamanho_kimono,
        tamanho_faixa,
        codigo_zempo
    ):
        conn = conectar(self.banco)
        try:
            cursor = conn.execute(
                """
                INSERT INTO alunos
                (nome, cpf, faixa, turma, tamanho_kimono,
                 tamanho_faixa, codigo_zempo)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    nome,
                    cpf,
                    faixa,
                    turma,
                    tamanho_kimono,
                    tamanho_faixa,
                    codigo_zempo
                ),
            )

            conn.commit()
            novo_id = cursor.lastrowid

        finally:
            conn.close()

        return {
            "id": novo_id,
            "nome": nome,
            "cpf": cpf,
            "faixa": faixa,
            "turma": turma,
            "tamanho_kimono": tamanho_kimono,
            "tamanho_faixa": tamanho_faixa,
            "codigo_zempo": codigo_zempo
        }

    def listar_alunos(self):
        conn = conectar(self.banco)
        try:
            linhas = conn.execute(
                """
                SELECT id, nome, cpf, faixa, turma,
                       tamanho_kimono, tamanho_faixa, codigo_zempo
                FROM alunos
                """
            ).fetchall()
        finally:
            conn.close()

        return [
            Aluno(
                linha["id"],
                linha["nome"],
                linha["cpf"],
                linha["faixa"],
                linha["turma"],
                linha["tamanho_kimono"],
                linha["tamanho_faixa"],
                linha["codigo_zempo"]
            )
            for linha in linhas
        ]