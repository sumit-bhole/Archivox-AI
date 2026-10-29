from supabase import create_client, Client
from app.core.config import settings

# We use the Service Role Key here so the backend has admin privileges to insert webhooks
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_KEY
)