from __future__ import annotations

import os
import sys
from typing import Dict, List, Tuple

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from backend.src.config import get_client  # noqa: E402
from backend.src.data_loader import load_products  # noqa: E402
from backend.src.router import route_user_message  # noqa: E402

ChatMessage = Dict[str, str]


class ChatService:
    def __init__(self):
        self._client = get_client()
        self._products = load_products()

    def respond(
        self,
        session_messages: List[ChatMessage],
        user_message: str,
        model: str = "openai.openai/gpt-5.2",
    ) -> Tuple[str, List[ChatMessage]]:
        reply, updated = route_user_message(
            self._client,
            self._products,
            session_messages,
            user_message,
            model=model,
        )
        return reply, updated
