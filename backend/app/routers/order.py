from fastapi import APIRouter, Depends, status, HTTPException
from ..database import get_db
from .. import schemas, models, oauth2
from sqlalchemy.orm import Session

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
    new_order_copy = new_order.dict().copy()
    new_order_copy["user_id"] = current_user.id
    order = models.Order(**new_order_copy)
    db.add(order)
    db.commit()

    db.query(models.Product).filter(models.Product.id == new_order.product_id).update(
        {"stock": models.Product.stock - 1},
        synchronize_session=False,
    )
    db.commit()

    return "Order added!"
