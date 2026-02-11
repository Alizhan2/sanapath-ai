from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .routes import survey, community, auth, ai_chat
from .routers import projects, users
from .database import init_db
from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database tables
    await init_db()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="SanaPath AI API",
    description="Career & Project Matching Platform for AI-Sana Ecosystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# CORS configuration for frontend (uses dynamic origins from settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(survey.router)
app.include_router(community.router)
app.include_router(projects.router)
app.include_router(users.router)
app.include_router(ai_chat.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to SanaPath AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "ecosystem": "AI-Sana",
        "students": "60,000+"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "sanapath-ai"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
