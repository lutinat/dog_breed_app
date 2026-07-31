"""Seed the `breeds` table from the ML checkpoint's breed_to_idx mapping,
and (re)populate `name_fr`/`fun_fact_en`/`fun_fact_fr` from the researched
content files.

Run from the repo root (same convention as the app itself):
    python -m backend.scripts.seed_breeds
"""

import json
from pathlib import Path

import torch

from backend.app.db import SessionLocal
from backend.app.models import Breed

CHECKPOINT_PATH = Path(__file__).resolve().parents[2] / "ml" / "resnet50_first_run.pth"
NAMES_FR_PATH = Path(__file__).resolve().parent / "breed_names_fr.json"
FACTS_EN_PATH = Path(__file__).resolve().parent / "breed_facts.json"
FACTS_FR_PATH = Path(__file__).resolve().parent / "breed_facts_fr.json"


def _load_json(path: Path) -> dict[str, str]:
    return json.loads(path.read_text()) if path.exists() else {}


def seed_breeds() -> None:
    checkpoint = torch.load(CHECKPOINT_PATH, map_location="cpu", weights_only=False)
    breed_names = sorted(checkpoint["breed_to_idx"].keys())
    names_fr = _load_json(NAMES_FR_PATH)
    facts_en = _load_json(FACTS_EN_PATH)
    facts_fr = _load_json(FACTS_FR_PATH)

    db = SessionLocal()
    try:
        existing_breeds = {b.name: b for b in db.query(Breed).all()}

        created = 0
        updated = 0
        for name in breed_names:
            name_fr = names_fr.get(name)
            fact_en = facts_en.get(name)
            fact_fr = facts_fr.get(name)
            breed = existing_breeds.get(name)
            if breed is None:
                db.add(Breed(name=name, name_fr=name_fr, fun_fact_en=fact_en, fun_fact_fr=fact_fr))
                created += 1
                continue

            changed = False
            if name_fr and breed.name_fr != name_fr:
                breed.name_fr = name_fr
                changed = True
            if fact_en and breed.fun_fact_en != fact_en:
                breed.fun_fact_en = fact_en
                changed = True
            if fact_fr and breed.fun_fact_fr != fact_fr:
                breed.fun_fact_fr = fact_fr
                changed = True
            if changed:
                updated += 1

        db.commit()
        print(
            f"Seeded {created} new breed(s), updated {updated} breed(s), "
            f"{len(breed_names)} total in checkpoint, {len(names_fr)} FR names, "
            f"{len(facts_en)} EN facts / {len(facts_fr)} FR facts available."
        )
    finally:
        db.close()


if __name__ == "__main__":
    seed_breeds()
