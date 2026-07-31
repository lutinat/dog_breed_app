"""create users, breeds, collection tables

Revision ID: 6233ae974ed8
Revises: 
Create Date: 2026-07-27 22:47:23.426615

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6233ae974ed8'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "breeds",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
    )
    op.create_index("ix_breeds_name", "breeds", ["name"], unique=True)

    op.create_table(
        "collection",
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("breed_id", sa.Integer(), sa.ForeignKey("breeds.id"), primary_key=True),
        sa.Column("discovered_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("collection")
    op.drop_index("ix_breeds_name", table_name="breeds")
    op.drop_table("breeds")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
