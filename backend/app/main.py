from fastapi import FastAPI
from .routers import test

app = FastAPI()

@app.get("/")
def get_root():
    return {"msg": "Namaste"}


app.include_router(test.router)
