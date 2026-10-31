from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
import logging
import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in .env file")
supabase: Client = create_client(supabase_url, supabase_key)

async def generate_prd_blueprint(call_id: str, project_id: str, transcript: str):
    """
    Async background task. If this fails, the transcript is already safe in the DB.
    """
    try:
        # Mark as processing
        supabase.table("project_calls").update({"generation_status": "processing"}).eq("id", call_id).execute()
        
        # NOTE: Implement your LLM extraction logic here using the transcript.
        # fake_ai_output = await my_llm_chain(transcript)
        
        # Update Project Core Features
        supabase.table("leads_prds").update({
            "core_features": "Generated from latest transcript..." # Replace with actual AI output
        }).eq("id", project_id).execute()

        # Mark call generation as completed
        supabase.table("project_calls").update({"generation_status": "completed"}).eq("id", call_id).execute()
        
    except Exception as e:
        logger.error(f"PRD Generation Failed: {str(e)}")
        # Log the failure securely, allowing manual retry from the dashboard
        supabase.table("project_calls").update({
            "generation_status": "failed",
            "generation_error": str(e)
        }).eq("id", call_id).execute()

@router.post("/bolna")
async def bolna_webhook(request: Request, background_tasks: BackgroundTasks):
    try:
        payload = await request.json()
        event_type = payload.get("event")
        execution_id = payload.get("execution_id") or payload.get("run_id")
        
        if event_type == "call_ended":
            transcript = payload.get("transcript", "")
            
            # 1. Fetch Call Record
            call_res = supabase.table("project_calls").select("id, project_id").eq("bolna_execution_id", execution_id).execute()
            
            if call_res.data:
                call_data = call_res.data[0]
                
                # 2. PERSIST TRANSCRIPT FIRST (Guaranteed reliability)
                supabase.table("project_calls").update({
                    "status": "completed",
                    "transcript": transcript,
                    "ended_at": "now()"
                }).eq("id", call_data["id"]).execute()

                # 3. Queue the fragile AI Generation as a background task
                background_tasks.add_task(
                    generate_prd_blueprint, 
                    call_id=call_data["id"], 
                    project_id=call_data["project_id"], 
                    transcript=transcript
                )

        return {"status": "received"}

    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")