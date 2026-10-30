from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import webhooks, agencies, leads, workspaces, bolna

app = FastAPI(title="Archivox Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(agencies.router, prefix="/api/agencies", tags=["Agencies"]) 
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"])
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(bolna.router, prefix="/api/bolna", tags=["Bolna"])

@app.get("/api/ping")
async def ping():
    return {"status": "alive"}