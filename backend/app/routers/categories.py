from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models
from sqlalchemy.orm import Session

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    q = db.query(models.Tag).all()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )
    return q
