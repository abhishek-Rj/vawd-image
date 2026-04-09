from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_message(message: dict):
    producer.send("image_processing", value=message)
    producer.flush()