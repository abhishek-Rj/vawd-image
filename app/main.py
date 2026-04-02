from fastapi import FastAPI, UploadFile, File
from app.routes.model.index import modelRouter
from app.routes.client.index import userRouter

app = FastAPI(title="vawd-image", version="0.0.1")

app.include_router(modelRouter, prefix="/model")
app.include_router(userRouter, prefix="/user")

@app.get("/")
def read_root():
    return {"message": "Hello to vawd-image", "status": "ok"}

@app.post("/check")
def upload_image(image: UploadFile = File(...)):
    return {"fileName": image.filename}