import boto3;
from app.lib.config import settings

client = boto3.client("bedrock-runtime", region_name=settings.AWS_REGION)