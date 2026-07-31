from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class PredictionItem(BaseModel):
    breed: str
    score: float


class PredictResponse(BaseModel):
    predictions: list[PredictionItem]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(Token):
    user: UserOut


class BreedOut(BaseModel):
    id: int
    name: str
    name_fr: str | None = None


class BreedsResponse(BaseModel):
    breeds: list[BreedOut]


class CollectionAddRequest(BaseModel):
    breed: str


class CollectionAddResponse(BaseModel):
    breed: BreedOut
    is_new_discovery: bool
    discovered_at: datetime
    # Only meaningful to show once, on first discovery — GET /breeds
    # deliberately omits this so the Collection grid can't leak facts for
    # breeds the user hasn't discovered yet. Both languages are returned;
    # the client picks the one matching its current UI language.
    fun_fact_en: str | None = None
    fun_fact_fr: str | None = None


class CollectionItemOut(BaseModel):
    breed_id: int
    name: str
    name_fr: str | None = None
    discovered_at: datetime
    fun_fact_en: str | None = None
    fun_fact_fr: str | None = None


class CollectionResponse(BaseModel):
    items: list[CollectionItemOut]
