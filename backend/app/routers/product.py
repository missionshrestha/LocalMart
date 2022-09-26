from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate, add_pagination

router = APIRouter(prefix="/product", tags=["Product"])


@router.get("/", response_model=Page[schemas.ProductGet])
def get_test(db: Session = Depends(get_db)):
    q = db.query(models.Product).all()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )
    return paginate(q)


@router.post("/")
def get_test(new_product: schemas.ProductPost, db: Session = Depends(get_db)):
    new_product = models.Product(**new_product.dict())
    db.add(new_product)
    db.commit()
    return "Product added!"


add_pagination(router)
