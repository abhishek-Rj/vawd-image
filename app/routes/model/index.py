from h11._abnf import status_code
from botocore import httpsession
from fastapi import HTTPException
from app.lib.pinecone_config import pinecone
from app.routes.model.clip import get_image_embedding
from fastapi import APIRouter, UploadFile, File;
from PIL import Image, UnidentifiedImageError
import io
import uuid


modelRouter = APIRouter();

@modelRouter.post("/upload_embedding")
async def image_upload(image: UploadFile = File(...)):
    try: 
        contents = await image.read()
        filename = image.filename
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty File")
        
        try:
            image = Image.open(io.BytesIO(contents)).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid Image File")
        
        try:
            embedding = get_image_embedding(image)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        image_id = str(uuid.uuid4())

        try: 
            pinecone.upsert([{
                "id": image_id,
                "values": embedding,
                "metadata": {
                    "filename": filename
                }
            }])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        return {
            "id": image_id,
            "filename": filename,
            "status_code": "stored"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        

@modelRouter.post("/upload")
async def image_upload(image: UploadFile = File(...)):
    try: 
        contents = await image.read()
        filename = image.filename
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty File")
        
        try:
            image = Image.open(io.BytesIO(contents)).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid Image File")
        
        embedding = get_image_embedding(image)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))