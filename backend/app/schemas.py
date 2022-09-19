from pydantic import BaseModel


class Test(BaseModel):
    column1: int
    column2: str

    class Config:
        orm_mode = True
