from fastapi import FastAPI
from .database import get_db
from .routers import test

app = FastAPI()


@app.get("/")
def get_root():
    print(get_db)
    return {"msg": "Namaste"}


app.include_router(test.router)
