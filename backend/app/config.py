import os
import secrets
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings with automatic validation via Pydantic."""
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # AI Settings
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    AI_PROVIDER: str = "gemini"
    AI_DEMO_MODE: str = "auto"
    
    @property
    def is_ai_demo(self) -> bool:
        """Smart demo mode: auto-detect if AI keys are available."""
        explicit = self.AI_DEMO_MODE.lower()
        if explicit == "true":
            return True
        if explicit == "false":
            return False
        return not self.has_ai_keys
    
    @property
    def has_ai_keys(self) -> bool:
        """Check if any AI API key is configured."""
        return bool(self.OPENAI_API_KEY or self.ANTHROPIC_API_KEY or self.GEMINI_API_KEY)

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sanapath.db"
    SUPABASE_JWT_SECRET: str = ""
    
    # JWT & Security
    SECRET_KEY: str = "YOUR_FALLBACK_SECRET_KEY_FOR_DEV_ONLY" 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: str = ""
    
    # URLs
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    CORS_ORIGINS: str = ""
    
    DEMO_MODE: bool = True
    ENVIRONMENT: str = "development"
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Get list of allowed CORS origins."""
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://sanapath-ai.vercel.app",
            "https://sanapath-ai-frontend.vercel.app",
            "https://sanapath-ai.netlify.app",
            "https://*.vercel.app",
            "https://*.netlify.app",
            self.FRONTEND_URL,
        ]
        if self.CORS_ORIGINS:
            origins.extend([o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()])
        return list(set(origins))

settings = Settings()

# Warn about missing configuration in production
if settings.is_production:
    if settings.SECRET_KEY == "YOUR_FALLBACK_SECRET_KEY_FOR_DEV_ONLY":
        print("⚠️  WARNING: SECRET_KEY not set in production! Using fallback key.")
    if not settings.has_ai_keys and not settings.is_ai_demo:
        print("⚠️  WARNING: No AI API keys configured and demo mode is off!")
    if settings.is_ai_demo:
        print("ℹ️  AI running in DEMO mode. Set GEMINI_API_KEY to enable real AI.")
    else:
        print(f"✅ AI running with {settings.AI_PROVIDER} provider")
