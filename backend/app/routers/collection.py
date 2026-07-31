from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..db import get_db
from ..models import Breed, Collection, User
from ..schemas import (
    BreedOut,
    BreedsResponse,
    CollectionAddRequest,
    CollectionAddResponse,
    CollectionItemOut,
    CollectionResponse,
)

router = APIRouter(tags=["collection"])


def _breed_out(breed: Breed) -> BreedOut:
    return BreedOut(id=breed.id, name=breed.name, name_fr=breed.name_fr)


@router.get("/breeds", response_model=BreedsResponse)
def list_breeds(db: Session = Depends(get_db)):
    breeds = db.query(Breed).order_by(Breed.name).all()
    return BreedsResponse(breeds=[_breed_out(b) for b in breeds])


@router.post("/collection", response_model=CollectionAddResponse)
def add_to_collection(
    payload: CollectionAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    breed = db.query(Breed).filter(Breed.name == payload.breed).first()
    if breed is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown breed")

    existing = db.get(Collection, (current_user.id, breed.id))
    if existing is not None:
        return CollectionAddResponse(
            breed=_breed_out(breed),
            is_new_discovery=False,
            discovered_at=existing.discovered_at,
        )

    entry = Collection(user_id=current_user.id, breed_id=breed.id)
    db.add(entry)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        entry = db.get(Collection, (current_user.id, breed.id))
        return CollectionAddResponse(
            breed=_breed_out(breed),
            is_new_discovery=False,
            discovered_at=entry.discovered_at,
        )
    db.refresh(entry)

    return CollectionAddResponse(
        breed=_breed_out(breed),
        is_new_discovery=True,
        discovered_at=entry.discovered_at,
        fun_fact_en=breed.fun_fact_en,
        fun_fact_fr=breed.fun_fact_fr,
    )


@router.get("/collection", response_model=CollectionResponse)
def get_collection(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Collection, Breed)
        .join(Breed, Collection.breed_id == Breed.id)
        .filter(Collection.user_id == current_user.id)
        .order_by(Collection.discovered_at)
        .all()
    )
    items = [
        CollectionItemOut(breed_id=breed.id, name=breed.name, name_fr=breed.name_fr, discovered_at=entry.discovered_at)
        for entry, breed in rows
    ]
    return CollectionResponse(items=items)
