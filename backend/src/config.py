import os

import openai
from dotenv import load_dotenv

# Load local env vars from backend/src/.env if present
load_dotenv(
    dotenv_path=os.path.join(os.path.dirname(__file__), ".env"),
    override=False,
)


def get_api_key():
    return os.getenv("VELOCITY_API_KEY")


def get_client():
    api_key = get_api_key()
    return openai.OpenAI(base_url="https://chat.velocity.online/api", api_key=api_key)
