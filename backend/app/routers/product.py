from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models, oauth2
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate, add_pagination
from slugify import slugify

router = APIRouter(prefix="/product", tags=["Product"])


@router.get("/", response_model=Page[schemas.ProductGet])
def get_products(db: Session = Depends(get_db)):
    q = db.query(models.Product).all()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )
    return paginate(q)


@router.post("/")
def add_product(
    new_product: schemas.ProductPost,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user),
):
    # could not modify new_product;
    add_current_user = new_product.dict().copy()
    add_current_user.update(
        {"created_by": current_user.id, "slug": slugify(new_product.title)}
    )

    new_product = models.Product(**add_current_user)
    db.add(new_product)
    db.commit()
    return "Product added!"


add_pagination(router)
