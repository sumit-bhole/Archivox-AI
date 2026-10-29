from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import logging
from app.services.ai_pipeline import generate_and_save_prd

logger = logging.getLogger(__name__)
router = APIRouter()

class LeadPayload(BaseModel):
    agency_id: str
    client_name: str
    project_summary: str
    core_features: str

@router.post("/submit")
async def submit_lead(payload: LeadPayload, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Received new project submission for agency: {payload.agency_id}")
        
        # We simulate the Bolna voice transcript by combining the form fields
        mock_transcript = f"""
        [Discovery Call Started]
        Client Name: {payload.client_name}
        Client explains their app idea: "{payload.project_summary}"
        Client specifically requested these features: "{payload.core_features}"
        [Call Ended]
        """
        
        # Hand off to your LangChain pipeline in a background thread
        background_tasks.add_task(generate_and_save_prd, payload.agency_id, mock_transcript)
        
        return {"status": "success", "message": "Project received. AI PRD generation started."}
        
    except Exception as e:
        logger.error(f"Error submitting lead: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")