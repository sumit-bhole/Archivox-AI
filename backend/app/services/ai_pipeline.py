import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from app.models.schemas import PRDResult
from app.core.database import supabase
from app.core.config import settings

logger = logging.getLogger(__name__)

def generate_and_save_prd(agency_id: str, transcript: str):
    """
    Takes the raw transcript, forces the LLM to extract a structured PRD, 
    and saves the final JSON directly into the Supabase database.
    """
    try:
        logger.info(f"Starting PRD generation for agency: {agency_id}")

        # 1. Initialize the LLM (Gemini 1.5 Flash is extremely fast and cheap for this)
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash-lite",
            api_key=settings.GEMINI_API_KEY,
            temperature=0.1 # Low temperature for strict, analytical output
        )
        
        # 2. Bind the LLM to our exact Pydantic schema (Structured Output)
        structured_llm = llm.with_structured_output(PRDResult)
        
        # 3. Create the extraction prompt
        prompt = PromptTemplate.from_template(
            """You are an elite Senior Software Architect. Read the following transcript of a client discovery call.
            Extract the requirements and return a highly technical Product Requirements Document (PRD).
            If a detail is missing, make a logical professional recommendation or note it in red flags.
            
            Call Transcript:
            {transcript}
            """
        )
        
        # 4. Execute the pipeline
        chain = prompt | structured_llm
        prd_data: PRDResult = chain.invoke({"transcript": transcript})
        
        # 5. Format for Database Insertion
        data_to_insert = {
            "agency_id": agency_id,
            "client_name": prd_data.client_name,
            "project_summary": prd_data.project_summary,
            # Supabase JSONB columns accept Python dictionaries/lists directly
            "core_features": [feature.model_dump() for feature in prd_data.core_features],
            "recommended_tech_stack": prd_data.recommended_tech_stack.model_dump(),
            "estimated_hours": prd_data.estimated_hours,
            "call_transcript": transcript
        }
        
        # 6. Save to Supabase (bypassing RLS safely via Service Key)
        response = supabase.table("leads_prds").insert(data_to_insert).execute()
        
        logger.info(f"Successfully generated and saved PRD for {prd_data.client_name}")
        return response.data

    except Exception as e:
        logger.error(f"CRITICAL ERROR in AI Pipeline: {str(e)}")
        # In a real startup, we'd trigger a Slack/Email alert here
        raise e