from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from ml.inference import predict
from ml.model import load_model

from .routers.auth import router as auth_router
from .routers.collection import router as collection_router
from .schemas import PredictResponse

CHECKPOINT_PATH = Path(__file__).resolve().parents[2] / "ml" / "resnet50_first_run.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

ml_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    model, idx_to_breed = load_model(str(CHECKPOINT_PATH), DEVICE)
    ml_state["model"] = model
    ml_state["idx_to_breed"] = idx_to_breed
    yield
    ml_state.clear()


app = FastAPI(title="Dog Breed App API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(collection_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
async def predict_breed(
    file: UploadFile = File(...),
    origin_x: int = Form(...),
    origin_y: int = Form(...),
    width: int = Form(...),
    height: int = Form(...),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    if width <= 0 or height <= 0:
        raise HTTPException(status_code=400, detail="Crop width and height must be positive")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")

    # No detection model exists yet — the crop box is drawn by the user on
    # the mobile app and its coordinates are just carried alongside the full
    # upload, so cropping happens here rather than on-device.
    cropped = image.crop((origin_x, origin_y, origin_x + width, origin_y + height))

    predictions = predict(
        model=ml_state["model"],
        idx_to_breed=ml_state["idx_to_breed"],
        image=cropped,
        device=DEVICE,
        top_k=3,
    )
    return {"predictions": predictions}
