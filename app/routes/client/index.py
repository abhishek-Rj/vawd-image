from fastapi import APIRouter
from app.routes.model.clip import get_text_embedding
from app.routes.model.format import format_data
from app.lib.pinecone_config import pinecone
from fastapi import HTTPException
from pydantic import BaseModel

userRouter = APIRouter()

class Prompt(BaseModel):
    prompt: str

@userRouter.post("/match_embedding")
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
                top_k=1,
                include_metadata=True
            )
            print(results)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        return {"result": format_data(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@userRouter.post("/text")
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
