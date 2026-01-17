from config import get_config
from models.analyze import AnalyzeRequest
from fastapi import Depends
from fastapi.routing import APIRouter
from services.twelvelabs import TwelveLabsService

twelvelabs_router = APIRouter()

@twelvelabs_router.post("/analyze")
async def analyze_video(
    request: AnalyzeRequest,
    settings: dict = Depends(get_config)    
):
    twelvelabs = TwelveLabsService(twelve_labs_api_key=settings["twelvelabs_api_key"])
    analysis_result = await twelvelabs.analyze_video(
        video_url=request.url,
    )

    return {"status": "success", "data": analysis_result}