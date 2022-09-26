from fastapi import FastAPI
from .routers import test, user, product

app = FastAPI()


@app.get("/")
def get_root():
    return {"msg": "Namaste"}


app.include_router(test.router)
app.include_router(user.router)
app.include_router(product.router)
