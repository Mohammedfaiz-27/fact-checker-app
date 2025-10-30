from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.claim_api import router as claim_router
from app.core.config import FRONTEND_URL

app = FastAPI()

# Configure CORS for production
# For Vercel deployments, use regex to allow preview URLs
if "vercel.app" in FRONTEND_URL:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
else:
    # For local development or other deployments
    allowed_origins = [
        FRONTEND_URL,
        FRONTEND_URL.rstrip("/") if FRONTEND_URL.endswith("/") else FRONTEND_URL + "/",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

app.include_router(claim_router, prefix="/api/claims")

@app.get("/")
async def root():
    return {"message": "Fact Checker API is running. Use /api/claims endpoint."}

# Vercel serverless function handler
from mangum import Mangum
handler = Mangum(app)
