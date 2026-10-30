from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
import logging
import os
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
    bolna_execution_id: Optional[str] = None

# THIS MUST BE /submit
@router.post("/submit")
async def submit_lead(payload: LeadPayload, background_tasks: BackgroundTasks):
    try:
        bolna_api_key = os.getenv("BOLNA_API_KEY")
        transcript_text = "No transcript found."

        if payload.bolna_execution_id and bolna_api_key:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.bolna.ai/executions/{payload.bolna_execution_id}",
                    headers={"Authorization": f"Bearer {bolna_api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    execution_data = response.json()
                    transcript_text = execution_data.get("transcript", "Empty recording.")
                else:
                    logger.warning(f"Failed to fetch transcript for {payload.bolna_execution_id}")

        structured_context = f"""
        [CLIENT META DATA]
        Name: {payload.client_name}
        Business: {payload.company_name}
        Summary: {payload.project_summary}

        [RAW BOLNA VOICE TRANSCRIPT]
        {transcript_text}
        """
        
        background_tasks.add_task(generate_and_save_prd, payload.agency_id, structured_context)
        
        return {"status": "success", "message": "Voice project received and PRD pipeline triggered."}
        
    except Exception as e:
        logger.error(f"Error submitting lead: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")