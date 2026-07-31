"""add name_fr to breeds

Revision ID: 4f822f029245
Revises: a9a5fbaf1b1b
Create Date: 2026-07-31 21:17:20.196949

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f822f029245'
down_revision: Union[str, Sequence[str], None] = 'a9a5fbaf1b1b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("breeds", sa.Column("name_fr", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("breeds", "name_fr")
