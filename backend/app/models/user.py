from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import uuid

# Association table for project collaborators
project_collaborators = Table(
    'project_collaborators',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True),
    Column('joined_at', DateTime, server_default=func.now())
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # Basic info
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Auth info - password for demo mode, OAuth for providers
    password_hash = Column(String, nullable=True)
    provider = Column(String, nullable=True)  # "github", "google", "demo"
    provider_id = Column(String, nullable=True)
    
    # Profile info (from survey) - using JSON for SQLite compatibility
    university = Column(String, nullable=True)
    programming_languages = Column(JSON, default=list)
    skill_level = Column(String, nullable=True)
    ai_ml_experience = Column(String, nullable=True)
    interest_areas = Column(JSON, default=list)
    career_goal = Column(String, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_profile_complete = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    owned_projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    collaborated_projects = relationship(
        "Project",
        secondary=project_collaborators,
        back_populates="collaborators"
    )
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    user_projects = relationship("UserProject", back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # Project info
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    difficulty_level = Column(String, nullable=True)
    tech_stack = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    estimated_duration = Column(String, nullable=True)
    
    # Roadmap stored as JSON string
    roadmap_json = Column(Text, nullable=True)
    
    # Community settings
    is_published = Column(Boolean, default=False)
    looking_for_collaborators = Column(Boolean, default=True)
    max_team_size = Column(Integer, default=4)
    
    # Owner
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="owned_projects")
    
    # Collaborators
    collaborators = relationship(
        "User",
        secondary=project_collaborators,
        back_populates="collaborated_projects"
    )
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    @property
    def current_members(self):
        return len(self.collaborators) + 1  # +1 for owner


class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # User who received this recommendation
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="recommendations")
    
    # Survey data snapshot
    survey_data_json = Column(Text, nullable=True)
    
    # AI response
    recommendations_json = Column(Text, nullable=False)
    personalization_summary = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserProject(Base):
    """
    Tracks user's active/completed projects (started from recommendations)
    """
    __tablename__ = "user_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # User who started this project
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="user_projects")
    
    # Project info (copied from recommendation or AI-generated)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # CV, NLP, etc.
    difficulty = Column(String, nullable=True)
    tech_stack = Column(JSON, default=list)
    
    # Learning goals & skills
    learning_goals = Column(JSON, default=list)
    skills_gained = Column(JSON, default=list)
    
    # Roadmap
    roadmap = Column(JSON, default=list)  # List of weeks with tasks
    
    # Progress tracking
    status = Column(String, default="active")  # active, completed, paused
    progress_percent = Column(Integer, default=0)
    current_week = Column(Integer, default=1)
    completed_tasks = Column(JSON, default=list)  # List of completed task IDs
    
    # Time tracking
    total_hours_spent = Column(Integer, default=0)
    estimated_hours = Column(Integer, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
