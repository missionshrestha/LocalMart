from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate, add_pagination

router = APIRouter(prefix="/test", tags=["Test"])


@router.get("/", response_model=Page[schemas.Test])
def get_test(db: Session = Depends(get_db)):
    q = db.query(models.Test).all()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with id: 2 does not exist",
        )
    return paginate(q)


add_pagination(router)
