from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate, add_pagination

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


@router.get("/{tag}", response_model=Page[schemas.ProductGet])
def search_products(tag: str | None = None, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter((models.Product.tag == tag)).all()

    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )

    for i in range(len(prod)):
        url_list = list(db.query(models.ImageURL.url).filter_by(id=prod[i].id))  # type: ignore
        prod[i].image_url = url_list  # type: ignore

        pf_list = list(db.query(models.ProductFeature.title, models.ProductFeature.description).filter_by(id=prod[i].id))  # type: ignore
        prod[i].product_feature = pf_list  # type: ignore

    return paginate(prod)


add_pagination(router)
