from datetime import datetime
from pydantic import BaseModel

class Test(BaseModel):
    column1: int
    column2: str

    class Config:
        orm_mode = True

class ProductGet(BaseModel):
    id : int
    title : str
    description : str
    created_at : datetime
    updated_at : datetime | None
    price : float

    class Config:
        orm_mode = True

class ProductPost(BaseModel):
    title : str
    description : str
    price : float

    class Config:
        orm_mode = True