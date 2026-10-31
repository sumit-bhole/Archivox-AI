from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
import os
import logging
from dotenv import load_dotenv

# 1. Load the environment variables BEFORE doing anything else
load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY") # Service role required for backend security

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in .env file")

supabase: Client = create_client(supabase_url, supabase_key)

class CallSubmitRequest(BaseModel):
    project_id: Optional[str] = None
    agency_id: str
    client_name: str
    client_email: str
    client_phone: str
    company_name: str
    project_name: str 
    project_summary: str
    bolna_execution_id: str
    call_duration: int
    call_status: str

@router.post("/submit")
async def submit_call_data(req: CallSubmitRequest):
    try:
        # 1. Project Resolution (Create if new, fetch if existing)
        actual_project_id = req.project_id
        
        if not actual_project_id:
            # Client selected "New Project", create it safely
            project_res = supabase.table("leads_prds").insert({
                "agency_id": req.agency_id,
                "client_email": req.client_email,
                "client_name": req.client_name,
                "company_name": req.company_name,
                "project_name": req.project_name, 
                "project_summary": req.project_summary,
                "status": "pending"
            }).execute()
            
            if not project_res.data:
                raise HTTPException(status_code=500, detail="Failed to create new project in database.")
            actual_project_id = project_res.data[0]['id']
            
        else:
            # Update last_activity for existing project so it jumps to the top of the CRM list
            supabase.table("leads_prds").update({
                "last_activity_date": "now()"
            }).eq("id", actual_project_id).execute()

        # 2. Persist the Call Record INDEPENDENTLY of the AI PRD generation
        call_res = supabase.table("project_calls").insert({
            "project_id": actual_project_id,
            "bolna_execution_id": req.bolna_execution_id,
            "status": req.call_status,
            "duration_seconds": req.call_duration,
            "generation_status": "pending" # Ready for the Bolna webhook to process the transcript
        }).execute()
        
        if not call_res.data:
            raise HTTPException(status_code=500, detail="Failed to log call execution.")

        return {
            "status": "success", 
            "project_id": actual_project_id, 
            "call_id": call_res.data[0]['id']
        }
        
    except Exception as e:
        logger.error(f"Call submission failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")