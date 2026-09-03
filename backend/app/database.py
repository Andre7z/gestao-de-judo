"""Onde a aplicacao encosta no banco: a conexao e o esquema.

Este arquivo e' a infraestrutura do banco de dados do sistema.
Todas as funcionalidades utilizam a conexao definida aqui.
"""

import sqlite3

BANCO = "zenyoapp.db"


ESQUEMA = """
CREATE TABLE IF NOT EXISTS alunos (
    id              INTEGER PRIMARY KEY,
    nome            TEXT NOT NULL,
    cpf             TEXT,
    faixa           TEXT NOT NULL,
    turma           TEXT,
    tamanho_kimono  TEXT,
    tamanho_faixa   TEXT,
    codigo_zempo    TEXT
);

CREATE TABLE IF NOT EXISTS atividades (
    id              INTEGER PRIMARY KEY,
    tipo            TEXT NOT NULL,
    titulo          TEXT NOT NULL,
    data            TEXT NOT NULL,
    local           TEXT,
    descricao       TEXT
);

CREATE TABLE IF NOT EXISTS atividade_alunos (
    id              INTEGER PRIMARY KEY,
    atividade_id    INTEGER NOT NULL,
    aluno_id        INTEGER NOT NULL,

    FOREIGN KEY (atividade_id)
        REFERENCES atividades(id)
        ON DELETE CASCADE,

    FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE CASCADE,

    UNIQUE (atividade_id, aluno_id)
);
"""


ALUNOS_INICIAIS = [
    (
        1,
        "João Silva",
        "11111111111",
        "Branca",
        "Infantil A",
        "M2",
        "120",
        "JU010101"
    ),
    (
        2,
        "Pedro Santos",
        "22222222222",
        "Amarela",
        "Infantil B",
        "M3",
        "140",
        "JU020202"
    ),
    (
        3,
        "Lucas Oliveira",
        "33333333333",
        "Verde",
        "Juvenil A",
        "M4",
        "150",
        "JU020203"
    ),
    (
        4,
        "Gabriel Souza",
        "44444444444",
        "Azul",
        "Juvenil B",
        "M5",
        "160",
        "JU030303"
    ),
    (
        5,
        "Carlos Pereira",
        "55555555555",
        "Roxa",
        "Adulto A",
        "A2",
        "170",
        "JU040404"
    ),
]


def conectar(banco=BANCO):
    """Cria uma conexao com o banco."""

    conn = sqlite3.connect(banco)

    # Permite acessar as colunas pelo nome:
    # row["nome"], row["faixa"], etc.
    conn.row_factory = sqlite3.Row

    # Permite que as FOREIGN KEY funcionem corretamente.
    conn.execute("PRAGMA foreign_keys = ON")

    return conn


def criar_banco(banco=BANCO):
    """Cria as tabelas e os alunos iniciais, se necessario."""

    conn = conectar(banco)

    try:
        # Cria as tabelas
        conn.executescript(ESQUEMA)

        # Verifica se ja existem alunos
        vazio = conn.execute(
            "SELECT COUNT(*) FROM alunos"
        ).fetchone()[0] == 0

        # Se nao existir nenhum aluno, cria os alunos iniciais
        if vazio:
            conn.executemany(
                """
                INSERT INTO alunos (
                    id,
                    nome,
                    cpf,
                    faixa,
                    turma,
                    tamanho_kimono,
                    tamanho_faixa,
                    codigo_zempo
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                ALUNOS_INICIAIS,
            )

        conn.commit()

    finally:
        conn.close()