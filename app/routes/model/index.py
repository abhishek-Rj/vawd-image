from app.routes.model.CLIP import get_image_embedding
from fastapi import APIRouter, UploadFile, File;
from PIL import Image
import io
import uuid


modelRouter = APIRouter();

@modelRouter.post("/upload_embedding")
async def image_upload(image: UploadFile = File(...)):
    contents = await image.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    embedding = get_image_embedding(image)
    image_id = str(uuid.uuid4())

    return {"embedding": embedding}
