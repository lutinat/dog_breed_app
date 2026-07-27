# Backend

FastAPI service that wraps the ResNet50 model in `/ml` and exposes it over HTTP.

## Setup

```bash
conda create -n dog_breed_app python=3.11
conda activate dog_breed_app
pip install -r backend/requirements.txt
```

## Run

Run from the **repo root** (not from `backend/`) — the app imports the `ml` package
which lives at the top of the repo, so the repo root needs to be on the Python path:

```bash
conda activate dog_breed_app
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

`--host 0.0.0.0` is required so the mobile app (running in Expo Go on a physical phone)
can reach the server over the LAN — `127.0.0.1` would only be reachable from this
machine.

The model (`ml/resnet50_first_run.pth`) loads once at startup, not per-request.

## Endpoints

- `GET /health` — liveness check, returns `{"status": "ok"}`.
- `POST /predict` — multipart form upload, field name `file`, must be an image.
  Returns the top 3 breed predictions:

  ```json
  {
    "predictions": [
      {"breed": "Shiba Dog", "score": 0.87},
      {"breed": "Pomeranian", "score": 0.06},
      {"breed": "Akita", "score": 0.03}
    ]
  }
  ```

  `score` is the raw softmax output, not a calibrated confidence — see
  [`docs/plan.md`](../docs/plan.md) for why. No threshold logic lives here; the client
  decides how to present low-score results.

## Manual test

```bash
curl -X POST http://localhost:8000/predict -F "file=@/path/to/a/dog/photo.jpg"
```
