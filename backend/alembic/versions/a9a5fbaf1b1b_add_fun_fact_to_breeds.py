"""add fun_fact_en and fun_fact_fr to breeds

Revision ID: a9a5fbaf1b1b
Revises: 6233ae974ed8
Create Date: 2026-07-31 20:56:18.195768

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a9a5fbaf1b1b'
down_revision: Union[str, Sequence[str], None] = '6233ae974ed8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("breeds", sa.Column("fun_fact_en", sa.Text(), nullable=True))
    op.add_column("breeds", sa.Column("fun_fact_fr", sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("breeds", "fun_fact_fr")
    op.drop_column("breeds", "fun_fact_en")
