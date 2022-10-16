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

    for i in range(len(q)):
        url_list = list(db.query(models.ImageURL.url).filter_by(id=q[i].id))
        q[i].image_url = url_list

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
    image_url: list = add_current_user["image_url"]
    add_current_user.pop("image_url")

    new_product = models.Product(**add_current_user)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    for url in image_url:
        format_img_url = {"id": new_product.id, "url": url}
        new_url = models.ImageURL(**format_img_url)
        db.add(new_url)
        db.commit()

    return "Product added!"


@router.get("/{slug}", response_model=schemas.ProductGet)
def get_product_slug(slug: str, db: Session = Depends(get_db)):

    product = db.query(models.Product).filter(models.Product.slug == slug).first()

    url_list = list(db.query(models.ImageURL.url).filter_by(id=product.id))  # type: ignore
    product.image_url = url_list  # type: ignore

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug: {slug} does not exist",
        )

    return product


@router.get("/search/", response_model=Page[schemas.ProductGet])
def search_products(q: str | None = None, db: Session = Depends(get_db)):
    q = "%{}%".format(q)
    prod = (
        db.query(models.Product)
        .filter(
            (models.Product.title.like(q))
            | (models.Product.description.like(q))
            | (models.Product.tags.like(q))
        )
        .all()
    )
    print(prod)
    for i in range(len(prod)):
        url_list = list(db.query(models.ImageURL.url).filter_by(id=prod[i].id))  # type: ignore
        prod[i].image_url = url_list  # type: ignore

    if not prod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )
    return paginate(prod)


add_pagination(router)
