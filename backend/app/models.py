from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=_utcnow)


class Breed(Base):
    __tablename__ = "breeds"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)


class Collection(Base):
    __tablename__ = "collection"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    breed_id: Mapped[int] = mapped_column(ForeignKey("breeds.id"), primary_key=True)
    discovered_at: Mapped[datetime] = mapped_column(default=_utcnow)
