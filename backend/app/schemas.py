from datetime import datetime
from pydantic import BaseModel, EmailStr


class ProductFeature(BaseModel):
    title: str
    description: str


class ProductGet(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    updated_at: datetime | None
    price: float
    created_by: int
    image_url: list
    product_feature: list[ProductFeature]
    tag: str
    slug: str
    discount_percentage: int
    stock: int
    is_used: bool

    class Config:
        orm_mode = True


class ProductPost(BaseModel):
    title: str
    description: str
    price: float
    image_url: list
    product_feature: list[ProductFeature]
    tag: str
    discount_percentage: int | None
    stock: int
    is_used: bool


class ProductUpdate(ProductPost):
    title: str | None
    description: str | None
    price: float | None
    image_url: list | None
    product_feature: list[ProductFeature] | None
    tag: str | None
    discount_percentage: int | None
    stock: int | None
    is_used: bool | None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str
    profile_img: str


class Error(BaseModel):
    msg: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    phone_number: str
    profile_img: str

    class Config:
        orm_mode = True


class Login(BaseModel):
    id: int
    access_token: str
    token_type: str
    name: str
    email: EmailStr
    profile_img: str


class TokenData(BaseModel):
    id: str | None


class OrderPost(BaseModel):
    product_id: int
