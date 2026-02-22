"""
API router for user projects (started projects from recommendations)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

from ..database import get_db
from ..models.user import User, UserProject
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])


# Pydantic models
class RoadmapWeek(BaseModel):
    week: int
    title: str
    tasks: List[str]


class ProjectCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    difficulty: Optional[str] = None
    tech_stack: List[str] = []
    learning_goals: List[str] = []
    skills_gained: List[str] = []
    roadmap: List[dict] = []
    estimated_hours: Optional[int] = None


class ProjectUpdate(BaseModel):
    status: Optional[str] = None
    progress_percent: Optional[int] = None
    current_week: Optional[int] = None
    completed_tasks: Optional[List[str]] = None
    total_hours_spent: Optional[int] = None


class ProjectResponse(BaseModel):
    id: int
    uuid: str
    title: str
    description: Optional[str]
    category: Optional[str]
    difficulty: Optional[str]
    tech_stack: List[str]
    learning_goals: List[str]
    skills_gained: List[str]
    roadmap: List[dict]
    status: str
    progress_percent: int
    current_week: int
    completed_tasks: List[str]
    total_hours_spent: int
    estimated_hours: Optional[int]
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int
    active_count: int
    completed_count: int


class GenerateProjectRequest(BaseModel):
    prompt: str


# Demo project templates for when user is not authenticated
DEMO_PROJECTS = [
    {
        "uuid": "demo-1",
        "title": "Image Classification with CNN",
        "description": "Build an image classifier using Convolutional Neural Networks with TensorFlow/PyTorch",
        "category": "Computer Vision",
        "difficulty": "Intermediate",
        "tech_stack": ["Python", "TensorFlow", "OpenCV", "NumPy"],
        "learning_goals": ["CNN architecture", "Image preprocessing", "Model evaluation"],
        "skills_gained": ["Deep Learning", "Computer Vision", "TensorFlow"],
        "roadmap": [
            {"week": 1, "title": "Setup & Data Preparation", "tasks": ["Install TensorFlow", "Load and explore dataset", "Data augmentation"]},
            {"week": 2, "title": "Build CNN Model", "tasks": ["Design CNN architecture", "Implement layers", "Add regularization"]},
            {"week": 3, "title": "Training & Evaluation", "tasks": ["Train model", "Evaluate metrics", "Tune hyperparameters"]},
            {"week": 4, "title": "Deployment", "tasks": ["Save model", "Create inference API", "Document project"]}
        ],
        "status": "active",
        "progress_percent": 25,
        "current_week": 1,
        "completed_tasks": [],
        "total_hours_spent": 4,
        "estimated_hours": 20
    }
]


from ..services.ai_engine import generate_custom_project

@router.post("/generate", response_model=ProjectCreate)
async def generate_project(
    request: GenerateProjectRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a custom project based on a user prompt using AI.
    """
    try:
        project_data = await generate_custom_project(request.prompt, current_user)
        return ProjectCreate(**project_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating project: {str(e)}")


@router.post("/start", response_model=ProjectResponse)
async def start_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a new project from recommendations or custom project
    """
    # Create new user project
    new_project = UserProject(
        user_id=current_user.id,
        title=project_data.title,
        description=project_data.description,
        category=project_data.category,
        difficulty=project_data.difficulty,
        tech_stack=project_data.tech_stack,
        learning_goals=project_data.learning_goals,
        skills_gained=project_data.skills_gained,
        roadmap=project_data.roadmap,
        estimated_hours=project_data.estimated_hours,
        status="active",
        progress_percent=0,
        current_week=1,
        completed_tasks=[],
        total_hours_spent=0
    )
    
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    
    return ProjectResponse(
        id=new_project.id,
        uuid=new_project.uuid,
        title=new_project.title,
        description=new_project.description,
        category=new_project.category,
        difficulty=new_project.difficulty,
        tech_stack=new_project.tech_stack or [],
        learning_goals=new_project.learning_goals or [],
        skills_gained=new_project.skills_gained or [],
        roadmap=new_project.roadmap or [],
        status=new_project.status,
        progress_percent=new_project.progress_percent,
        current_week=new_project.current_week,
        completed_tasks=new_project.completed_tasks or [],
        total_hours_spent=new_project.total_hours_spent,
        estimated_hours=new_project.estimated_hours,
        started_at=new_project.started_at,
        completed_at=new_project.completed_at
    )


@router.get("/my-projects", response_model=ProjectListResponse)
async def get_my_projects(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all projects for current user
    """
    query = select(UserProject).where(UserProject.user_id == current_user.id)
    
    if status_filter:
        query = query.where(UserProject.status == status_filter)
    
    query = query.order_by(UserProject.started_at.desc())
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    active_count = sum(1 for p in projects if p.status == "active")
    completed_count = sum(1 for p in projects if p.status == "completed")
    
    return ProjectListResponse(
        projects=[
            ProjectResponse(
                id=p.id,
                uuid=p.uuid,
                title=p.title,
                description=p.description,
                category=p.category,
                difficulty=p.difficulty,
                tech_stack=p.tech_stack or [],
                learning_goals=p.learning_goals or [],
                skills_gained=p.skills_gained or [],
                roadmap=p.roadmap or [],
                status=p.status,
                progress_percent=p.progress_percent,
                current_week=p.current_week,
                completed_tasks=p.completed_tasks or [],
                total_hours_spent=p.total_hours_spent,
                estimated_hours=p.estimated_hours,
                started_at=p.started_at,
                completed_at=p.completed_at
            )
            for p in projects
        ],
        total=len(projects),
        active_count=active_count,
        completed_count=completed_count
    )


@router.get("/{project_uuid}", response_model=ProjectResponse)
async def get_project(
    project_uuid: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get single project by UUID
    """
    result = await db.execute(
        select(UserProject).where(
            UserProject.uuid == project_uuid,
            UserProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return ProjectResponse(
        id=project.id,
        uuid=project.uuid,
        title=project.title,
        description=project.description,
        category=project.category,
        difficulty=project.difficulty,
        tech_stack=project.tech_stack or [],
        learning_goals=project.learning_goals or [],
        skills_gained=project.skills_gained or [],
        roadmap=project.roadmap or [],
        status=project.status,
        progress_percent=project.progress_percent,
        current_week=project.current_week,
        completed_tasks=project.completed_tasks or [],
        total_hours_spent=project.total_hours_spent,
        estimated_hours=project.estimated_hours,
        started_at=project.started_at,
        completed_at=project.completed_at
    )


@router.patch("/{project_uuid}", response_model=ProjectResponse)
async def update_project(
    project_uuid: str,
    update_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update project progress, status, or completed tasks
    """
    result = await db.execute(
        select(UserProject).where(
            UserProject.uuid == project_uuid,
            UserProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update fields
    if update_data.status is not None:
        project.status = update_data.status
        if update_data.status == "completed":
            project.completed_at = datetime.utcnow()
            project.progress_percent = 100
    
    if update_data.progress_percent is not None:
        project.progress_percent = update_data.progress_percent
    
    if update_data.current_week is not None:
        project.current_week = update_data.current_week
    
    if update_data.completed_tasks is not None:
        project.completed_tasks = update_data.completed_tasks
        
        # Auto-calculate progress based on completed tasks
        total_tasks = sum(len(week.get("tasks", [])) for week in (project.roadmap or []))
        if total_tasks > 0:
            project.progress_percent = int((len(update_data.completed_tasks) / total_tasks) * 100)
    
    if update_data.total_hours_spent is not None:
        project.total_hours_spent = update_data.total_hours_spent
    
    await db.commit()
    await db.refresh(project)
    
    return ProjectResponse(
        id=project.id,
        uuid=project.uuid,
        title=project.title,
        description=project.description,
        category=project.category,
        difficulty=project.difficulty,
        tech_stack=project.tech_stack or [],
        learning_goals=project.learning_goals or [],
        skills_gained=project.skills_gained or [],
        roadmap=project.roadmap or [],
        status=project.status,
        progress_percent=project.progress_percent,
        current_week=project.current_week,
        completed_tasks=project.completed_tasks or [],
        total_hours_spent=project.total_hours_spent,
        estimated_hours=project.estimated_hours,
        started_at=project.started_at,
        completed_at=project.completed_at
    )


@router.delete("/{project_uuid}")
async def delete_project(
    project_uuid: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a project
    """
    result = await db.execute(
        select(UserProject).where(
            UserProject.uuid == project_uuid,
            UserProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    await db.delete(project)
    await db.commit()
    
    return {"message": "Project deleted successfully"}


@router.post("/{project_uuid}/complete-task")
async def complete_task(
    project_uuid: str,
    task_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a task as completed
    """
    result = await db.execute(
        select(UserProject).where(
            UserProject.uuid == project_uuid,
            UserProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    completed_tasks = project.completed_tasks or []
    if task_id not in completed_tasks:
        completed_tasks.append(task_id)
        project.completed_tasks = completed_tasks
        
        # Recalculate progress
        total_tasks = sum(len(week.get("tasks", [])) for week in (project.roadmap or []))
        if total_tasks > 0:
            project.progress_percent = int((len(completed_tasks) / total_tasks) * 100)
        
        await db.commit()
    
    return {
        "message": "Task completed",
        "completed_tasks": completed_tasks,
        "progress_percent": project.progress_percent
    }
