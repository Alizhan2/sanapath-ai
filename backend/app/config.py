import os
import secrets
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings with environment variable support."""
    
    # AI Settings - NO hardcoded keys!
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")  # Must be set in .env
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")  # "openai", "anthropic", or "gemini"
    AI_DEMO_MODE: bool = os.getenv("AI_DEMO_MODE", "auto").lower() == "true"  # "auto" = detect from keys
    
    @property
    def is_ai_demo(self) -> bool:
        """Smart demo mode: auto-detect if AI keys are available."""
        explicit = os.getenv("AI_DEMO_MODE", "auto").lower()
        if explicit == "true":
            return True
        if explicit == "false":
            return False
        # Auto-detect: demo only if NO keys configured
        return not self.has_ai_keys
    
    # Database - SQLite by default, PostgreSQL for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./sanapath.db")

    # Supabase - JWT secret for verifying Supabase-issued tokens
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # JWT - Generate secure key if not provided
    SECRET_KEY: str = os.getenv("SECRET_KEY", "") or secrets.token_urlsafe(32)
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # OAuth - GitHub
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    
    # OAuth - Google
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # OAuth - LinkedIn
    LINKEDIN_CLIENT_ID: str = os.getenv("LINKEDIN_CLIENT_ID", "")
    LINKEDIN_CLIENT_SECRET: str = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    
    # URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    # CORS - Additional allowed origins (comma-separated)
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "")
    
    # Demo mode - allows login without OAuth
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, staging, production
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def has_ai_keys(self) -> bool:
        """Check if any AI API key is configured."""
        return bool(self.OPENAI_API_KEY or self.ANTHROPIC_API_KEY or self.GEMINI_API_KEY)
    
    @property
    def cors_origins_list(self) -> list:
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
        return list(set(origins))  # Remove duplicates


settings = Settings()

# Warn about missing configuration in production
if settings.is_production:
    if not os.getenv("SECRET_KEY"):
        print("⚠️  WARNING: SECRET_KEY not set in production! Using generated key.")
    if not settings.has_ai_keys and not settings.is_ai_demo:
        print("⚠️  WARNING: No AI API keys configured and demo mode is off!")
    if settings.is_ai_demo:
        print("ℹ️  AI running in DEMO mode. Set GEMINI_API_KEY to enable real AI.")
    else:
        print(f"✅ AI running with {settings.AI_PROVIDER} provider")
