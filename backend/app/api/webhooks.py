from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
import logging
from app.services.ai_pipeline import generate_and_save_prd

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/bolna")
async def bolna_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Receives the call.completed event from Bolna and triggers PRD generation.
    """
    try:
        payload = await request.json()
        
        transcript = payload.get("transcript", "")
        # Custom data is passed from the React frontend when the call initiates
        custom_data = payload.get("custom_data", {})
        agency_id = custom_data.get("agency_id")

        if not transcript:
            return {"status": "ignored", "reason": "No transcript provided"}
            
        if not agency_id:
            logger.error("Webhook rejected: Missing agency_id in custom_data")
            raise HTTPException(status_code=400, detail="Missing agency_id")

        # Hand off the heavy LangChain extraction to a background thread
        background_tasks.add_task(generate_and_save_prd, agency_id, transcript)
        
        # Return success instantly so Bolna knows the webhook was received
        return {"status": "success", "message": "PRD generation started."}
        
    except Exception as e:
        logger.error(f"Error processing Bolna webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")