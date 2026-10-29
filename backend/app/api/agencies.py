from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import supabase
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class AgencyCreate(BaseModel):
    user_id: str
    agency_name: str
    email: str

@router.post("/create-profile")
async def create_agency_profile(data: AgencyCreate):
    try:
        # The backend uses the Service Role Key, bypassing RLS safely
        response = supabase.table("agencies").insert({
            "id": data.user_id,
            "agency_name": data.agency_name,
            "company_name": data.agency_name
        }).execute()
        
        return {"status": "success", "message": "Profile created securely"}
    except Exception as e:
        logger.error(f"Failed to create profile: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not create agency profile")