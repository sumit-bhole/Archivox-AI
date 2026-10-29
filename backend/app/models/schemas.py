from pydantic import BaseModel, Field
from typing import List

class Feature(BaseModel):
    title: str = Field(description="Short, clear title of the feature (e.g., 'User Authentication')")
    description: str = Field(description="Technical description of what the feature does")
    user_story: str = Field(description="Agile user story format (e.g., 'As a user, I want to...')")

class TechStack(BaseModel):
    frontend: str = Field(description="Recommended frontend framework (e.g., React, Next.js, Flutter)")
    backend: str = Field(description="Recommended backend framework (e.g., FastAPI, Node.js)")
    database: str = Field(description="Recommended database (e.g., PostgreSQL, MongoDB)")
    reasoning: str = Field(description="1-sentence explanation of why this stack is the best fit")

class PRDResult(BaseModel):
    client_name: str = Field(description="Name of the client. If not mentioned, use 'Unknown Client'")
    project_summary: str = Field(description="A 2-3 sentence executive summary of the application idea")
    core_features: List[Feature] = Field(description="List of the 3 to 5 core features extracted from the call")
    recommended_tech_stack: TechStack = Field(description="The ideal technology stack for this project")
    estimated_hours: int = Field(description="Estimated total development hours required for the MVP")
    red_flags: List[str] = Field(description="Any missing info, technical risks, or out-of-scope requests mentioned")