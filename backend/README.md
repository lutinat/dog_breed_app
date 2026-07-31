# Backend

FastAPI service that wraps the ResNet50 model in `/ml` and exposes it over HTTP.

## Setup

```bash
conda create -n dog_breed_app python=3.11
conda activate dog_breed_app
pip install -r backend/requirements.txt
```

### Database

Requires PostgreSQL running locally. Create a dedicated role + database (one-time):

```bash
sudo -u postgres createuser --pwprompt dog_breed_app
sudo -u postgres createdb -O dog_breed_app dog_breed_app
```

Copy `backend/.env.example` to `backend/.env` and fill in `DATABASE_URL` (using the
password you just set) and a random `JWT_SECRET_KEY`. `backend/.env` is gitignored —
never commit it.

Apply migrations and seed the breed reference table (run from the **repo root**, same
convention as running the app — see below):

```bash
alembic -c backend/alembic.ini upgrade head
python -m backend.scripts.seed_breeds
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

- `POST /auth/register` — `{email, password}` -> `201` with `access_token` (auto-login)
  and the created user. `409` if the email is already registered.
- `POST /auth/login` — `{email, password}` -> `200` with `access_token`.
- `GET /auth/me` — `Authorization: Bearer <token>` -> the current user.
- `GET /breeds` — public, the full list of `{id, name}` breed reference rows.
- `POST /collection` — auth required, `{breed: "<exact breed string from /predict>"}` ->
  `{breed, is_new_discovery, discovered_at}`. Idempotent: re-adding an already-owned
  breed returns `is_new_discovery: false` instead of erroring.
- `GET /collection` — auth required, the current user's discovered breeds.

Access tokens are JWTs valid for 30 days (`ACCESS_TOKEN_EXPIRE_MINUTES` in
`backend/app/config.py`) — no refresh tokens, no password reset/email verification in
this MVP phase (see the project's `docs/plan.md`).

## Manual test

```bash
curl -X POST http://localhost:8000/predict -F "file=@/path/to/a/dog/photo.jpg"

# Auth + collection flow
TOKEN=$(curl -s -X POST localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"testpass123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

curl -s localhost:8000/auth/me -H "Authorization: Bearer $TOKEN"
curl -s -X POST localhost:8000/collection -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"breed": "Afghan hound"}'
curl -s localhost:8000/collection -H "Authorization: Bearer $TOKEN"
```
