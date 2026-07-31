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


class BreedsResponse(BaseModel):
    breeds: list[BreedOut]


class CollectionAddRequest(BaseModel):
    breed: str


class CollectionAddResponse(BaseModel):
    breed: BreedOut
    is_new_discovery: bool
    discovered_at: datetime


class CollectionItemOut(BaseModel):
    breed_id: int
    name: str
    discovered_at: datetime


class CollectionResponse(BaseModel):
    items: list[CollectionItemOut]
