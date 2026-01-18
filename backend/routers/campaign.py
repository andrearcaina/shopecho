from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from config import get_config, get_backboard_client
from services.campaign import CampaignService
from backboard import BackboardClient

campaign_router = APIRouter()

@campaign_router.post("/video")
async def create_campaign_video(
    client: BackboardClient = Depends(get_backboard_client)
):
    """
    Synchronous endpoint to generate videos.
    """
    service = CampaignService(
        client=client
    )
    
    # Blocking call to service
    video = await service.generate_video_scripts()

    resp = {
        "videos": [
            {"file_path": path} for path in video["elevenlabs_video_file_paths"]
        ]
    }

    print(resp)

    return resp

@campaign_router.get("/video/{filename}")
async def get_campaign_video_file(filename: str):
    """
    Endpoint to retrieve generated video files.
    """
    file_path = f"services/{filename}"
    return FileResponse(path=file_path, filename=filename, media_type='video/mp4')

@campaign_router.post("/email")
async def create_campaign_email(
    client: BackboardClient = Depends(get_backboard_client)
):
    """
    Endpoint to publish and track AI-generated campaigns to Shopify.
    """
    service = CampaignService(
        client=client
    )
    
    # Blocking call to service
    email = await service.generate_draft_email()

    print(email)

    return {"status": "success", "email": email}