from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging
from app.services.ai_pipeline import generate_and_save_prd

logger = logging.getLogger(__name__)
router = APIRouter()

class LeadPayload(BaseModel):
    agency_id: str
    client_name: str
    client_email: Optional[str] = None
    company_name: Optional[str] = None
    project_summary: str
    core_features: str
    budget: Optional[str] = None
    timeline: Optional[str] = None

@router.post("/submit")
async def submit_lead(payload: LeadPayload, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Received new project submission for agency: {payload.agency_id}")
        
        # Inject the new deep-context variables so Gemini can architect better
        mock_transcript = f"""
        [Discovery Call Data]
        Client Name: {payload.client_name} ({payload.company_name})
        Budget Tier: {payload.budget}
        Timeline: {payload.timeline}
        
        Client explains their app idea: "{payload.project_summary}"
        Client specifically requested these features: "{payload.core_features}"
        """
        
        background_tasks.add_task(generate_and_save_prd, payload.agency_id, mock_transcript)
        return {"status": "success", "message": "Project received."}
        
    except Exception as e:
        logger.error(f"Error submitting lead: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")