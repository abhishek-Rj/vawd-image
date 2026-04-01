from app.lib.config import settings
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key=settings.PINECONE_API)

index_name = "image_search"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=512,
        metric="consine",
        spec=ServerlessSpec(
            cloud="aws",
            region=settings.AWS_REGION
        )
    )

pinecone = pc.Index(index_name)