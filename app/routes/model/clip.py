from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import torch.nn.functional as F
import numpy as np

model_id = "openai/clip-vit-base-patch32"

model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id)

def get_image_embedding(image: Image.Image):
    inputs = processor(images=[image], return_tensors="pt")

    with torch.no_grad():
        out = model.get_image_features(**inputs)
    
    features = out.pooler_output

    embedding = features[0].cpu().detach().numpy().flatten()
    
    embedding = embedding / np.linalg.norm(embedding)

    return embedding.tolist()


def get_text_embedding(text: str):
    inputs = processor(text=[text], return_tensors="pt")

    with torch.no_grad():
        out = model.get_text_features(**inputs)

    features = out.pooler_output
    embedding = F.normalize(features, p=2, dim=1)
    embedding = embedding[0].cpu().detach().numpy().flatten()
    
    return embedding.tolist()