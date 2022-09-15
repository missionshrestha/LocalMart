from operator import ge
from fastapi import FastAPI
from .database import get_db

app = FastAPI()


@app.get("/")
def get_root():
    print(get_db)
    return {"msg": "Namaste"}