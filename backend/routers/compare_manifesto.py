from fastapi import APIRouter, Depends
from pydantic import BaseModel
from config import get_config, get_backboard_client
from services.compare_manifesto import CompareManifestoService
from backboard import BackboardClient

compare_manifesto_router = APIRouter()

class CompareManifestoRequest(BaseModel):
    summary: str

@compare_manifesto_router.post("/compare")
async def compare_manifesto(
    request: CompareManifestoRequest,
    settings: dict = Depends(get_config),
    client: BackboardClient = Depends(get_backboard_client)    
):
    """Compare a video summary against the brand manifesto"""
    
    service = CompareManifestoService(
        summary=request.summary,
        backboard_api_key=settings["backboard_api_key"],
        client=client
    )
    
    result = await service._generate_comparison_with_backboard(
        summary=request.summary
    )
    
    return {"status": "success", "comparison": result}