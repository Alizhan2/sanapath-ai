from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..database import get_db
from ..models.user import User, UserProject
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


class UserStats(BaseModel):
    total_projects: int = 0
    completed_projects: int = 0
    completed_tasks: int = 0
    completed_weeks: int = 0
    streak: int = 0
    xp: int = 0
    level: int = 1
    joined_community: bool = False
    resources_used: int = 0

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    stats: UserStats = Field(default_factory=UserStats)
    created_at: datetime = Field(default_factory=datetime.now)

class Achievement(BaseModel):
    id: str
    title: str
    description: str
    points: int
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class UserSettings(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    weekly_digest: bool = True
    project_updates: bool = True
    community_activity: bool = False
    marketing_emails: bool = False
    profile_public: bool = True
    show_activity: bool = True
    show_projects: bool = True
    show_achievements: bool = True
    theme: str = "dark"
    reduced_motion: bool = False
    sound_effects: bool = True
    language: str = "en"

# Predefined achievements
ACHIEVEMENTS = [
    {"id": "first_project", "title": "First Launch", "description": "Start your first AI project", "points": 100},
    {"id": "week_complete", "title": "Week Warrior", "description": "Complete your first week", "points": 200},
    {"id": "three_projects", "title": "Project Pro", "description": "Start 3 different projects", "points": 300},
    {"id": "streak_7", "title": "On Fire!", "description": "Maintain a 7-day streak", "points": 500},
    {"id": "ten_tasks", "title": "Task Master", "description": "Complete 10 tasks", "points": 250},
    {"id": "community_join", "title": "Team Player", "description": "Join a community project", "points": 150},
    {"id": "first_complete", "title": "Finisher", "description": "Complete your first project", "points": 1000},
    {"id": "code_master", "title": "Code Master", "description": "Complete 50 tasks total", "points": 750},
    {"id": "scholar", "title": "AI Scholar", "description": "Use 20+ learning resources", "points": 400},
]


async def _compute_stats_from_db(user_id: int, db: AsyncSession) -> dict:
    """Compute real user stats from database projects."""
    result = await db.execute(
        select(UserProject).where(UserProject.user_id == user_id)
    )
    projects = result.scalars().all()

    total_projects = len(projects)
    completed_projects = sum(1 for p in projects if p.status == "completed")
    completed_tasks = sum(len(p.completed_tasks or []) for p in projects)
    completed_weeks = sum(p.current_week - 1 for p in projects if p.current_week > 1)

    xp = completed_tasks * 10 + completed_projects * 100 + completed_weeks * 50
    level = max(1, xp // 500 + 1)

    return {
        "total_projects": total_projects,
        "completed_projects": completed_projects,
        "completed_tasks": completed_tasks,
        "completed_weeks": completed_weeks,
        "streak": 0,
        "xp": xp,
        "level": level,
        "joined_community": False,
        "resources_used": 0,
    }


@router.get("/profile/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's profile and stats computed from real projects."""
    stats = await _compute_stats_from_db(current_user.id, db)
    return {
        "id": current_user.uuid,
        "name": current_user.name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "stats": stats,
        "created_at": current_user.created_at,
    }


@router.get("/profile/{user_id}")
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get user profile by UUID (public)."""
    result = await db.execute(select(User).where(User.uuid == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    stats = await _compute_stats_from_db(user.id, db)
    return {
        "id": user.uuid,
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "stats": stats,
        "created_at": user.created_at,
    }


@router.get("/stats/me")
async def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's statistics (computed from projects)."""
    return await _compute_stats_from_db(current_user.id, db)


@router.get("/stats/{user_id}")
async def get_user_stats(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get user stats by UUID."""
    result = await db.execute(select(User).where(User.uuid == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return UserStats().model_dump()
    return await _compute_stats_from_db(user.id, db)


@router.get("/achievements/{user_id}")
async def get_user_achievements(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get user achievements (computed from stats)."""
    result = await db.execute(select(User).where(User.uuid == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return [{"id": a["id"], **a, "unlocked": False} for a in ACHIEVEMENTS]

    stats = await _compute_stats_from_db(user.id, db)

    conditions = {
        "first_project": stats["total_projects"] >= 1,
        "week_complete": stats["completed_weeks"] >= 1,
        "three_projects": stats["total_projects"] >= 3,
        "streak_7": stats["streak"] >= 7,
        "ten_tasks": stats["completed_tasks"] >= 10,
        "community_join": stats["joined_community"],
        "first_complete": stats["completed_projects"] >= 1,
        "code_master": stats["completed_tasks"] >= 50,
        "scholar": stats["resources_used"] >= 20,
    }

    return [{**a, "unlocked": conditions.get(a["id"], False)} for a in ACHIEVEMENTS]


@router.get("/settings/{user_id}")
async def get_user_settings(user_id: str):
    """Get user settings (defaults for now)."""
    return UserSettings().model_dump()


@router.put("/settings/{user_id}")
async def update_user_settings(user_id: str, settings_data: UserSettings):
    """Update user settings."""
    return settings_data.model_dump()


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, db: AsyncSession = Depends(get_db)):
    """Get top users by number of completed projects."""
    result = await db.execute(select(User).where(User.is_active == True))
    users = result.scalars().all()

    leaderboard = []
    for u in users:
        stats = await _compute_stats_from_db(u.id, db)
        leaderboard.append({
            "id": u.uuid,
            "name": u.name or "Anonymous",
            "avatar_url": u.avatar_url,
            "xp": stats["xp"],
            "level": stats["level"],
        })

    leaderboard.sort(key=lambda x: x["xp"], reverse=True)
    return leaderboard[:limit]


@router.post("/activity/{user_id}")
async def log_activity(user_id: str, activity_type: str):
    """Log user activity (placeholder for future implementation)."""
    return {"message": "Activity logged", "activity_type": activity_type}
