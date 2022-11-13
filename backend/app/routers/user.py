from .. import models, schemas, utils
from fastapi import status, HTTPException, Depends, APIRouter, Response
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/user", tags=["User"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserOut | schemas.Error,
)
def create_user(
    response: Response,
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):

    # Check if user already exists
    prev_user = db.query(models.User).filter(models.User.email == user.email).first()
    if prev_user != None:
        response.status_code = status.HTTP_409_CONFLICT
        return {"msg": "User already exists."}

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/{id}", response_model=schemas.UserOut)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {id} does not exist",
        )

    return user


@router.get("/{usr_id}/product", response_model=list[schemas.ProductGet])
def get_products(usr_id: int, db: Session = Depends(get_db)):
    q = db.query(models.Product).filter(models.Product.created_by == usr_id).all()
    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product does not exist",
        )
    for i in range(len(q)):
        url_list = list(db.query(models.ImageURL.url).filter_by(id=q[i].id))
        product_feature = list(
            db.query(
                models.ProductFeature.title, models.ProductFeature.description
            ).filter_by(id=q[i].id)
        )
        q[i].image_url = url_list
        q[i].product_feature = product_feature

    return q
