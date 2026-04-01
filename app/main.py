from fastapi import FastAPI, UploadFile, File
from app.lib.config import settings
from app.routes.model.index import modelRouter

app = FastAPI(title="vawd-image", version="0.0.1")


app.include_router(modelRouter, prefix="/model")

@app.get("/")
def read_root():
    return {"message": "Hello to vawd-image", "status": "ok"}

@app.post("/check")
def upload_image(image: UploadFile = File(...)):
    return {"fileName": image.filename}