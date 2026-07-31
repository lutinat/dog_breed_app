"""Seed the `breeds` table from the ML checkpoint's breed_to_idx mapping.

Run from the repo root (same convention as the app itself):
    python -m backend.scripts.seed_breeds
"""

from pathlib import Path

import torch

from backend.app.db import SessionLocal
from backend.app.models import Breed

CHECKPOINT_PATH = Path(__file__).resolve().parents[2] / "ml" / "resnet50_first_run.pth"


def seed_breeds() -> None:
    checkpoint = torch.load(CHECKPOINT_PATH, map_location="cpu", weights_only=False)
    breed_names = sorted(checkpoint["breed_to_idx"].keys())

    db = SessionLocal()
    try:
        existing = {name for (name,) in db.query(Breed.name).all()}
        new_breeds = [Breed(name=name) for name in breed_names if name not in existing]
        db.add_all(new_breeds)
        db.commit()
        print(f"Seeded {len(new_breeds)} new breed(s), {len(breed_names)} total in checkpoint.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_breeds()
