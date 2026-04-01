from h11._abnf import status_code
from fastapi import HTTPException
from app.lib.pinecone_config import pinecone
from app.routes.model.clip import get_image_embedding, get_text_embedding
from fastapi import APIRouter, UploadFile, File;
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel
from app.routes.model.format import format_data
import io
import uuid

modelRouter = APIRouter();

@modelRouter.post("/populate_image_embedding")
async def populate_image_embedding(image: UploadFile = File(...)):
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

@modelRouter.post("/image")
async def image_retrieve(image: UploadFile = File(...)):
    try: 
        contents = await image.read()
        
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


class Prompt(BaseModel):
    prompt: str

@modelRouter.post("/match_embedding")
async def populate_text_embedding(prompt: Prompt):
    try: 
        if not prompt.prompt:
            raise HTTPException(status_code=400, detail="Empty Prompt")
        
        try:
            embedding = get_text_embedding(prompt.prompt)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        try:
            results = pinecone.query(
                vector=embedding,
                top_k=5,
                include_metadata=True
            )
            print(results)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        return {"result": format_data(results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@modelRouter.post("/text")
async def prompt_retrieve(prompt: Prompt):
    print(type(prompt.prompt))
    try: 
        if not prompt.prompt:
            raise HTTPException(status_code=400, detail="Empty Prompt")
        
        try:
            embedding = get_text_embedding(prompt.prompt)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
