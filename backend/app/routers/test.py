from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models
from sqlalchemy.orm import Session

router = APIRouter(prefix="/test", tags=["Test"])


@router.get("/", response_model=schemas.Test)
def get_test(db: Session = Depends(get_db)):
    q = db.query(models.Test).filter(models.Test.column1 == 1).first()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with id: 1 does not exist",
        )
    return q
