from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import numpy as np

model_id = "openai/clip-vit-base-patch32"

model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id)

def get_image_embedding(image: Image.Image):
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        features = model.get_image_features(**inputs)
    
    embedding = features[0].numpy()
    embedding = embedding / np.linalg.norm(embedding)

    return embedding.tolist()