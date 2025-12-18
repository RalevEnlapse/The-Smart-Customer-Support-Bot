import os
from dotenv import load_dotenv
import openai

load_dotenv()

def get_api_key():
    return os.getenv("VELOCITY_API_KEY")

def get_client():
    api_key = get_api_key()
    return openai.OpenAI(base_url="https://chat.velocity.online/api", api_key=api_key)