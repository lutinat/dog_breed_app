from pydantic import BaseModel


class PredictionItem(BaseModel):
    breed: str
    score: float


class PredictResponse(BaseModel):
    predictions: list[PredictionItem]
