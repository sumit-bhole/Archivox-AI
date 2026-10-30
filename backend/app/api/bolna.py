from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

class BolnaSessionRequest(BaseModel):
    agent_id: str
    client_name: str
    business_name: str
    business_type: Optional[str] = "Business"
    short_desc: Optional[str] = "Looking for software solutions."

# THIS MUST BE /create-session
@router.post("/create-session")
async def create_webrtc_session(req: BolnaSessionRequest):
    try:
        bolna_api_key = os.getenv("BOLNA_API_KEY")
        if not bolna_api_key:
            raise ValueError("Backend configuration error.")

        bolna_api_url = "https://api.bolna.ai/web-call/session"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                bolna_api_url,
                headers={
                    "Authorization": f"Bearer {bolna_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "agent_id": req.agent_id,
                    "user_data": {
                        "client_name": req.client_name,
                        "business_name": req.business_name,
                        "business_type": req.business_type,
                        "short_desc": req.short_desc
                    }
                },
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to authorize voice session.")
                
            return response.json()

    except Exception as e:
        logger.error(f"Error creating Bolna session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")