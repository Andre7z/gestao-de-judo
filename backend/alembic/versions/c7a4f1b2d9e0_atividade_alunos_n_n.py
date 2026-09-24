"""transforma vinculo de atividades e alunos em n:n

Revision ID: c7a4f1b2d9e0
Revises: 1e97d0dd461a
Create Date: 2026-09-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c7a4f1b2d9e0"
down_revision: Union[str, Sequence[str], None] = "1e97d0dd461a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "atividade_alunos",
        sa.Column("atividade_id", sa.Integer(), nullable=False),
        sa.Column("aluno_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["atividade_id"], ["atividades.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["aluno_id"], ["alunos.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("atividade_id", "aluno_id"),
    )

    op.execute(
        sa.text(
            "INSERT INTO atividade_alunos (atividade_id, aluno_id) "
            "SELECT id, aluno_id FROM atividades WHERE aluno_id IS NOT NULL"
        )
    )

    with op.batch_alter_table("atividades", schema=None) as batch_op:
        batch_op.drop_column("aluno_id")


def downgrade() -> None:
    with op.batch_alter_table("atividades", schema=None) as batch_op:
        batch_op.add_column(sa.Column("aluno_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_atividades_aluno_id",
            "alunos",
            ["aluno_id"],
            ["id"],
        )

    op.execute(
        sa.text(
            "UPDATE atividades SET aluno_id = associacao.aluno_id "
            "FROM (SELECT atividade_id, MIN(aluno_id) AS aluno_id "
            "FROM atividade_alunos GROUP BY atividade_id) AS associacao "
            "WHERE atividades.id = associacao.atividade_id"
        )
    )
    op.drop_table("atividade_alunos")
