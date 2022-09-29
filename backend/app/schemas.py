from datetime import datetime
from tkinter.messagebox import NO
from pydantic import BaseModel, EmailStr


class ProductGet(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    updated_at: datetime | None
    price: float

    class Config:
        orm_mode = True


class ProductPost(BaseModel):
    title: str
    description: str
    price: float

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    phone_number: str

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    phone_number: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: str | None
