from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
import httpx
import logging
import os
from dotenv import load_dotenv

# 1. Load the environment variables from the .env file BEFORE doing anything else
load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize Supabase for backend-secure queries
# (Make sure these are in your Render Environment Variables)
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in .env file")
supabase: Client = create_client(supabase_url, supabase_key)

# 1. Updated Request Model to receive the strict identity and context markers from React
class BolnaSessionRequest(BaseModel):
    agent_id: str
    agency_id: str
    client_email: str
    client_name: str
    business_name: str
    project_id: Optional[str] = None
    agency_context: str
    ai_tone: str
    important_info: str
    client_intent: str
    language: str

# THIS MUST BE /create-session
@router.post("/create-session")
async def create_webrtc_session(req: BolnaSessionRequest):
    try:
        bolna_api_key = os.getenv("BOLNA_API_KEY")
        if not bolna_api_key:
            raise ValueError("Backend configuration error: BOLNA_API_KEY missing.")

        bolna_api_url = "https://api.bolna.ai/web-call/session"
        
        # 2. Secure Project History Retrieval & Context Assembly
        project_context = ""
        if req.project_id:
            # STRICT AUTHORIZATION: Ensure this project actually belongs to this email & agency
            res = supabase.table("leads_prds").select("project_summary, core_features").eq("id", req.project_id).eq("agency_id", req.agency_id).eq("client_email", req.client_email).execute()
            
            if not res.data:
                raise HTTPException(status_code=403, detail="Unauthorized: Project identity mismatch.")
                
            project_data = res.data[0]
            core_features = project_data.get("core_features", "")
            summary = project_data.get("project_summary", "")
            
            # Compress the historical data for token efficiency
            project_context = (
                f"PROJECT STATUS: EXISTING/RETURNING CLIENT.\n"
                f"You are speaking to a returning client about their project: '{summary}'.\n"
                f"PREVIOUSLY CONFIRMED REQUIREMENTS:\n{core_features}\n"
                f"AI DIRECTIVE: Acknowledge you remember this project. Do not ask for basic requirements we already have. "
                f"Ask what updates, changes, or new requirements they want to discuss today."
            )
        else:
            project_context = (
                "PROJECT STATUS: NEW.\n"
                "This is a fresh discovery session. Guide the client to understand their core objectives and requirements."
            )

        # Combine all dynamic contexts into the short_desc field that Bolna injects into the prompt
        enhanced_short_desc = (
            f"🚨 CRITICAL RULE: You MUST speak EXCLUSIVELY in {req.language}. Do not use any other language! 🚨\n\n"
            f"CLIENT INTENT TODAY: {req.client_intent}\n\n"
            f"AGENCY CAPABILITIES: {req.agency_context}\n\n"
            f"INSTRUCTIONS: Tone: {req.ai_tone}. Must Collect: {req.important_info}\n\n"
            f"{project_context}"
        )

        # 3. Call Bolna API
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
                        "short_desc": enhanced_short_desc # Injecting the smart context here!
                    }
                },
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to authorize voice session with Bolna.")
                
            return response.json()

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error creating Bolna session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")