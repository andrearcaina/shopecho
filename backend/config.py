# config.py or inside main.py
import os
from functools import lru_cache
from backboard import BackboardClient
from dotenv import load_dotenv

load_dotenv()

@lru_cache() # caches the result so it doesn't read env vars every time
def get_config():
    return {
        "shopify_api_key": os.getenv("SHOPIFY_API_KEY"),
        "shopify_api_secret": os.getenv("SHOPIFY_API_SECRET"),
        "backboard_api_key": os.getenv("BACKBOARD_API_KEY"),
        "twelvelabs_api_key": os.getenv("TWELVELABS_API_KEY"),
    }

@lru_cache()
def get_backboard_client(): # caches client so we can have persistent memory (backboard)
    return BackboardClient(get_config()["backboard_api_key"])
