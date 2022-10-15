from datetime import datetime
from pydantic import BaseModel, EmailStr


class ProductGet(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    updated_at: datetime | None
    price: float
    created_by: int
    image_url: list
    tags: str
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
    tags: str
    discount_percentage: int | None
    stock: int
    is_used: bool

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str
    profile_img: str

    class Config:
        orm_mode = True


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
    access_token: str
    token_type: str
    name: str
    email: EmailStr
    profile_img: str


class TokenData(BaseModel):
    id: str | None
