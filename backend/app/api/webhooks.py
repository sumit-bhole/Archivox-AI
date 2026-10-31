from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
import logging
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

# Supabase Setup
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in .env file")
supabase: Client = create_client(supabase_url, supabase_key)

# Gemini Setup
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("Missing GEMINI_API_KEY in .env file")
genai.configure(api_key=gemini_api_key)

async def generate_prd_blueprint(call_id: str, project_id: str, transcript: str):
    """
    Background Task: Uses Gemini to merge the new transcript with existing requirements,
    outputs strict JSON, and updates the database.
    """
    try:
        supabase.table("project_calls").update({"generation_status": "processing"}).eq("id", call_id).execute()
        
        # 1. Fetch current project state
        proj_res = supabase.table("leads_prds").select("core_features, project_summary").eq("id", project_id).execute()
        current_features = proj_res.data[0].get("core_features", [])
        project_summary = proj_res.data[0].get("project_summary", "")

        # 2. Gemini Prompt Design
        prompt = f"""
        You are an expert Software Architect. Review the following call transcript and integrate any new requirements, changes, or features into the existing project blueprint.

        Project Summary: {project_summary}
        Current Blueprint (JSON format): {current_features}

        NEW CALL TRANSCRIPT:
        {transcript}

        Analyze the transcript and return ONLY a raw JSON object with the following strict structure. Do not include markdown formatting or backticks.
        {{
            "updated_master_requirements": [
                {{
                    "title": "Feature Name",
                    "description": "Clear technical or business description.",
                    "user_story": "As a [user], I want to [action] so that [benefit]."
                }}
            ],
            "changelog": [
                {{
                    "type": "added", 
                    "desc": "Client requested X feature.", 
                    "old": "None", 
                    "new": "Feature X"
                }}
            ]
        }}
        Note: The 'type' in changelog must be exactly one of: 'added', 'modified', 'removed', 'clarified', 'decision'.
        """

        # 3. Generate content with Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        
        # 4. Parse the output
        ai_output = json.loads(response.text)

        # 5. Save the new master PRD back to the project
        supabase.table("leads_prds").update({
            "core_features": ai_output.get("updated_master_requirements", []),
            "last_activity_date": "now()"
        }).eq("id", project_id).execute()

        # 6. Save the immutable changelog history
        changelog = ai_output.get("changelog", [])
        if changelog:
            change_records = []
            for change in changelog:
                change_records.append({
                    "project_id": project_id,
                    "call_id": call_id,
                    "change_type": change.get("type", "clarified"),
                    "description": change.get("desc", "Requirement updated"),
                    "previous_value": change.get("old", ""),
                    "new_value": change.get("new", "")
                })
            supabase.table("requirement_changes").insert(change_records).execute()

        # 7. Mark success
        supabase.table("project_calls").update({
            "generation_status": "completed",
            "generation_error": None
        }).eq("id", call_id).execute()
        
    except Exception as e:
        logger.error(f"PRD Generation Failed: {str(e)}")
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
            # Check if Bolna sent the extracted summary, otherwise fall back to raw transcript
            transcript = payload.get("extracted_data", {}).get("Call Summary") or payload.get("transcript", "")
            
            call_res = supabase.table("project_calls").select("id, project_id, status").eq("bolna_execution_id", execution_id).execute()
            
            if call_res.data:
                call_data = call_res.data[0]
                
                # Idempotency check to prevent duplicate processing
                if call_data.get("status") == "completed":
                    return {"status": "already processed"}
                
                # Persist transcript FIRST
                supabase.table("project_calls").update({
                    "status": "completed",
                    "transcript": transcript,
                    "ended_at": "now()"
                }).eq("id", call_data["id"]).execute()

                # Queue Gemini generation
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

@router.post("/retry-generation/{call_id}")
async def retry_generation(call_id: str, background_tasks: BackgroundTasks):
    call_res = supabase.table("project_calls").select("*").eq("id", call_id).execute()
    if not call_res.data:
        raise HTTPException(status_code=404, detail="Call not found")
        
    call = call_res.data[0]
    
    supabase.table("project_calls").update({"retry_count": call.get("retry_count", 0) + 1}).eq("id", call_id).execute()
    
    background_tasks.add_task(
        generate_prd_blueprint, 
        call_id=call_id, 
        project_id=call["project_id"], 
        transcript=call["transcript"]
    )
    return {"status": "retrying"}