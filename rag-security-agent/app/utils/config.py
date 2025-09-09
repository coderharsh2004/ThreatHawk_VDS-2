import os
from typing import Optional, List
from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# ✅ Explicitly load .env file before Pydantic runs
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))


class Settings(BaseSettings):
    """Application configuration settings"""

    # API Configuration
    google_api_key: str = Field(..., description="Google Gemini API Key")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)
    debug: bool = Field(default=True)

    # LangChain Configuration
    langchain_tracing_v2: bool = Field(default=False)
    langchain_api_key: Optional[str] = Field(default=None)
    langchain_project: str = Field(default="rag-security-agent")

    # Vector Store Configuration
    chroma_db_path: str = Field(default="./chroma_db")
    embeddings_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")
    chunk_size: int = Field(default=1000)
    chunk_overlap: int = Field(default=200)

    # Model Configuration
    gemini_model: str = Field(default="gemini-2.5-flash")
    model_temperature: float = Field(default=0.1)
    max_tokens: int = Field(default=2048)

    # Security Configuration
    max_file_size_mb: int = Field(default=10)
    allowed_extensions: List[str] = Field(default=["json"])

    # Logging Configuration
    log_level: str = Field(default="INFO")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


# Global settings instance
settings = Settings()

print("DEBUG GOOGLE_API_KEY:", settings.google_api_key[:8] + "..." if settings.google_api_key else None)


def get_settings() -> Settings:
    """Get application settings"""
    return settings


def validate_configuration():
    """Validate critical configuration settings"""
    if not settings.google_api_key or settings.google_api_key == "your_gemini_api_key_here":
        raise ValueError("GOOGLE_API_KEY environment variable is required and must be set to a valid API key")

    if not os.path.exists(os.path.dirname(settings.chroma_db_path)):
        os.makedirs(os.path.dirname(settings.chroma_db_path), exist_ok=True)

    print("✓ Configuration validated successfully")
    return True
