from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
	AWS_REGION: str
	PINECONE_API: str
	AUTH_SERVICE: str
	KAFKA_SERVICE: str

	model_config = SettingsConfigDict(
		env_file=".env",
	)

settings = Settings()