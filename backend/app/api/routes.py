from __future__ import annotations

from typing import Any, Dict

from flask import Blueprint, jsonify, request

from ..services.chat_service import ChatService
from ..stores.session_store import InMemorySessionStore
from ..utils.errors import ApiError

api = Blueprint("api", __name__, url_prefix="/api")

_store = InMemorySessionStore.create()
_chat: ChatService | None = None


def _chat_service() -> ChatService:
    global _chat
    if _chat is None:
        _chat = ChatService()
    return _chat


def _get_json() -> Dict[str, Any]:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


@api.get("/health")
def health():
    return jsonify({"ok": True})


@api.post("/session")
def create_session():
    session_id = _store.new_session()
    return jsonify({"session_id": session_id})


@api.post("/chat")
def chat():
    data = _get_json()

    session_id = data.get("session_id")
    message = data.get("message")
    model = data.get("model")

    if not session_id or not isinstance(session_id, str):
        raise ApiError("session_id is required", 400, "missing_session")
    if not message or not isinstance(message, str):
        raise ApiError("message must be a non-empty string", 400, "invalid_message")

    if model is None:
        model = "openai.openai/gpt-5.2"
    if not isinstance(model, str) or not model.strip():
        raise ApiError("model must be a non-empty string", 400, "invalid_model")

    history = _store.get(session_id)
    if history is None:
        raise ApiError("session_id not found", 404, "session_not_found")

    reply, updated = _chat_service().respond(history, message, model=model)
    _store.set(session_id, updated)

    return jsonify(
        {"reply": reply, "messages": updated, "session_id": session_id, "model": model}
    )


@api.post("/reset")
def reset():
    data = _get_json()
    session_id = data.get("session_id")

    if not session_id or not isinstance(session_id, str):
        raise ApiError("session_id is required", 400, "missing_session")

    ok = _store.reset(session_id)
    if not ok:
        raise ApiError("session_id not found", 404, "session_not_found")

    return jsonify({"ok": True})
