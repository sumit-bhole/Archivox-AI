from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import supabase
import logging
import re
import uuid

logger = logging.getLogger(__name__)
router = APIRouter()

class WorkspaceCreate(BaseModel):
    user_id: str
    workspace_type: str
    name: str
    title: Optional[str] = None
    website: Optional[str] = None
    country: str
    city: str
    team_size: Optional[str] = None
    services: List[str] = []
    description: Optional[str] = None

@router.post("")
async def create_workspace(data: WorkspaceCreate):
    try:
        # 1. Generate a URL-safe, unique slug based on their name
        base_slug = re.sub(r'[^a-z0-9]+', '-', data.name.lower()).strip('-')
        unique_suffix = str(uuid.uuid4())[:6] # Adds random chars to guarantee uniqueness
        url_slug = f"{base_slug}-{unique_suffix}"

        # 2. Prepare Workspace Data
        workspace_payload = {
            "name": data.name,
            "url_slug": url_slug, # Save the slug to the DB
            "workspace_type": data.workspace_type,
            "website": data.website,
            "country": data.country,
            "city": data.city,
            "team_size": data.team_size,
            "description": data.description,
            "services": data.services,
            "onboarding_completed": True
        }
        
        ws_response = supabase.table("workspaces").insert(workspace_payload).execute()
        
        if not ws_response.data:
            raise HTTPException(status_code=500, detail="Failed to create workspace record.")
            
        workspace_id = ws_response.data[0]['id']

        member_payload = {
            "workspace_id": workspace_id,
            "user_id": data.user_id,
            "member_role": "owner"
        }
        supabase.table("workspace_members").insert(member_payload).execute()

        if data.workspace_type == 'freelancer' and data.title:
            supabase.table("profiles").update({"job_title": data.title}).eq("id", data.user_id).execute()

        return {"status": "success", "workspace_id": workspace_id}

    except Exception as e:
        logger.error(f"Transaction failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))