import re
from typing import Any, Dict, List, Tuple

from backend.src.services.order_service import get_order_status
from backend.src.services.llm_service import answer_product_question


def is_order_status_query(text: str) -> bool:
    t = (text or "").lower()
    return "order" in t and "status" in t


def extract_order_id(text: str) -> str:
    """Best-effort extraction: pick last run of digits, else last token."""
    if not text:
        return "unknown"

    m = re.findall(r"\b\d+\b", text)
    if m:
        return m[-1]

    words = text.split()
    return words[-1] if words else "unknown"


def route_user_message(
    client: Any,
    products: List[Dict[str, Any]],
    session_messages: List[Dict[str, str]],
    user_message: str,
    model: str = "openai.openai/gpt-5.2",
) -> Tuple[str, List[Dict[str, str]]]:
    """Routes message to order-status or product-Q&A.

    session_messages format: [{"role": "user"|"assistant", "content": "..."}, ...]
    Returns: (assistant_reply, updated_session_messages)
    """

    session_messages = list(session_messages or [])
    session_messages.append({"role": "user", "content": user_message})

    if is_order_status_query(user_message):
        order_id = extract_order_id(user_message)
        status = get_order_status(order_id)
        reply = (
            "### Order status\n\n"
            f"- Order ID: **{order_id}**\n"
            f"- Status: {status}\n\n"
            "### Next steps\n"
            "- If you want, share any extra details from your confirmation email (carrier / tracking number) and I can help interpret it.\n"
        )
    else:
        # Keep minimal history; the LLM prompt builder formats it in markdown.
        history = "\n".join([f"{m['role']}: {m['content']}" for m in session_messages[-10:]])
        question_with_history = (
            f"Conversation so far:\n{history}\n\n" f"Current user question: {user_message}"
        )
        reply = answer_product_question(client, products, question_with_history, model=model)

    session_messages.append({"role": "assistant", "content": reply})
    return reply, session_messages
