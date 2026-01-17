from pydantic import BaseModel

class ManifestoRequest(BaseModel):
    shop_domain: str
    access_token: str