from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import webhooks, agencies, leads, workspaces, bolna

app = FastAPI(title="Archivox Backend")

# Configure CORS so your Vercel React frontend can communicate with this Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Note: In the future, you can lock this down to your exact Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routes
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(agencies.router, prefix="/api/agencies", tags=["Agencies"]) 
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"])
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])

# This connects the new Project-Aware AI logic we just built in bolna.py
app.include_router(bolna.router, prefix="/api/bolna", tags=["Bolna"]) 

# Health check endpoint (Render uses this to know your app is alive)
@app.get("/api/ping")
async def ping():
    return {"status": "alive", "message": "Archivox API is running securely"}