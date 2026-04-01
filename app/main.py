from fastapi import FastAPI
from app.lib.config import settings
from app.routes.model.index import modelRouter

app = FastAPI(title="vawd-image", version="0.0.1")


app.include_router(modelRouter, prefix="/model")

@app.get("/")
def read_root():
    return {"message": "Hello to vawd-image", "status": "ok"}