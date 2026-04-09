import uuid
from kafka import KafkaConsumer
import json
from io import BytesIO
from PIL import Image
from app.routes.model.clip import get_image_embedding
from app.lib.pinecone_config import pinecone
import requests

consumer = KafkaConsumer(
    "image_processing",
    bootstrap_servers=["localhost:9092"],
    value_deserializer=lambda v: json.loads(v.decode('utf-8')),
    auto_offset_reset="earliest"
)

def img_to_bytes(url: str) -> BytesIO:
    import requests
    response = requests.get(url, timeout=5)

    if response.status_code != 200:
        raise Exception("Failed to fetch image")

    return BytesIO(response.content)


for msg in consumer:
    try:
        data = msg.value
        print("Received:", data)

        image_url = data["image_url"]
        user_id = data["user_id"]
        filename = data["filename"]

        img_bytes = img_to_bytes(image_url)
        image = Image.open(img_bytes).convert("RGB")

        embedding = get_image_embedding(image)

        image_id = str(uuid.uuid4())

        pinecone.upsert([{
            "id": image_id,
            "values": embedding,
            "metadata": {
                "filename": filename,
                "image_url": image_url,
                "user_id": user_id,
            }
        }])

        response = requests.post(
            "http://localhost:4000/posts/update_image_status",
            json={
                "image_id": image_id,
                "status": "success"
            }
        )

        print("Update response:", response.status_code, response.text)

    except Exception as e:
        import traceback
        traceback.print_exc()

