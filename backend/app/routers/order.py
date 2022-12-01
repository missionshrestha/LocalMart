from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models, oauth2
from sqlalchemy.orm import Session
from sqlalchemy import and_

router = APIRouter(prefix="/order", tags=["Order"])


@router.get("/")
def get_order(
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user),
):
    orders = (
        db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    )

    if not orders:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order list is empty!",
        )

    products = []
    for i in range(len(orders)):
        products.append(
            db.query(models.Product)
            .filter(models.Product.id == orders[i].product_id)
            .first()
        )

    return products


@router.post("/")
def add_order(
    new_order: schemas.OrderPost,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user),
):
    stock = (
        db.query(models.Product.stock)
        .filter(models.Product.id == new_order.product_id)
        .first()
    )
    # print(stock[0])
    if stock[0] < new_order.quantity:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Not sufficent stock",
        )
    new_order_copy = new_order.dict().copy()
    new_order_copy["user_id"] = current_user.id
    order = models.Order(**new_order_copy)
    db.add(order)
    db.commit()

    db.query(models.Product).filter(models.Product.id == new_order.product_id).update(
        {"stock": models.Product.stock - new_order.quantity},
        synchronize_session=False,
    )
    db.commit()

    return "Order added!"


@router.get("/{product_id}")
def get_all_orders(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(oauth2.get_current_user),
):

    result = (
        db.query(models.Product)
        .filter(
            and_(
                models.Product.id == product_id,
                models.Product.created_by == current_user.id,
            )
        )
        .all()
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    ordered_by = (
        db.query(
            models.Order.product_id,
            models.Order.quantity,
            models.Order.created_at,
            models.User.name,
            models.User.email,
            models.User.phone_number,
            models.User.profile_img,
        )
        .join(models.User, models.User.id == models.Order.user_id)
        .filter(models.Order.product_id == product_id)
        .all()
    )

    return ordered_by
