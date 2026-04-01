from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
	AWS_REGION: str
	MODEL_ID: str
	PINECONE_API: str

	model_config = SettingsConfigDict(
		env_file=".env",
	)

settings = Settings()