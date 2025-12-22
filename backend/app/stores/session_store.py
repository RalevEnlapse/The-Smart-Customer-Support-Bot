from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass
from typing import Dict, List, Optional


ChatMessage = Dict[str, str]  # {"role": "user"|"assistant", "content": "..."}


@dataclass
class InMemorySessionStore:
    """Thread-safe in-memory store. Suitable for local dev.

    Swap later with Redis/DB by implementing the same methods.
    """

    _lock: threading.Lock
    _sessions: Dict[str, List[ChatMessage]]

    @classmethod
    def create(cls) -> "InMemorySessionStore":
        return cls(_lock=threading.Lock(), _sessions={})

    def new_session(self) -> str:
        session_id = str(uuid.uuid4())
        with self._lock:
            self._sessions[session_id] = []
        return session_id

    def get(self, session_id: str) -> Optional[List[ChatMessage]]:
        with self._lock:
            messages = self._sessions.get(session_id)
            return list(messages) if messages is not None else None

    def set(self, session_id: str, messages: List[ChatMessage]) -> None:
        with self._lock:
            self._sessions[session_id] = list(messages or [])

    def reset(self, session_id: str) -> bool:
        with self._lock:
            if session_id not in self._sessions:
                return False
            self._sessions[session_id] = []
            return True
