from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional


def _md_escape_inline(text: str) -> str:
    # Very light escaping for table cells / inline content.
    return (text or "").replace("|", "\\|").strip()


def support_agent_system_prompt() -> str:
    return (
        "You are a smart customer support assistant. "
        "You must respond in clean GitHub-flavored Markdown. "
        "Be concise, friendly, and actionable.\n\n"
        "Style rules:\n"
        "- Prefer short sections with headings (###).\n"
        "- Use bullet points for key facts.\n"
        "- Use tables when comparing multiple products.\n"
        "- Do not invent facts. If information is missing, ask 1-2 clarifying questions.\n"
        "- Always end with a '### Next steps' section, unless the user only said hi.\n"
        "- Keep answers under ~180 words unless the user asks for detail.\n"
    )


def build_products_context(products: List[Dict[str, Any]], limit: int = 60) -> str:
    """Compact product catalog context for the model.

    Uses a markdown table to improve readability and downstream rendering.
    """

    rows = []
    for p in (products or [])[:limit]:
        try:
            rows.append(
                {
                    "id": str(p.get("id", "")),
                    "name": str(p.get("name", "")),
                    "category": str(p.get("category", "")),
                    "price": str(p.get("price", "")),
                    "description": str(p.get("description", "")),
                }
            )
        except Exception:
            # If a product is malformed, skip it.
            continue

    if not rows:
        return "Product catalog is empty."

    header = "| ID | Name | Category | Price | Description |\n|---:|---|---|---:|---|"
    body_lines = []
    for r in rows:
        body_lines.append(
            "| {id} | {name} | {category} | {price} | {description} |".format(
                id=_md_escape_inline(r["id"]),
                name=_md_escape_inline(r["name"]),
                category=_md_escape_inline(r["category"]),
                price=_md_escape_inline(r["price"]),
                description=_md_escape_inline(r["description"]),
            )
        )

    return "\n".join(["### Product catalog", header, *body_lines])


def build_conversation_context(messages: List[Dict[str, str]], last_n: int = 10) -> str:
    """Formats recent conversation into a compact markdown transcript."""

    trimmed = list(messages or [])[-last_n:]
    lines: List[str] = ["### Conversation (most recent first)"]

    for m in trimmed[::-1]:
        role = (m.get("role") or "").strip().lower()
        content = (m.get("content") or "").strip()
        if not content:
            continue
        label = "User" if role == "user" else "Assistant"
        lines.append(f"- **{label}:** {content}")

    return "\n".join(lines)


def build_user_prompt(user_question: str) -> str:
    return (
        "### User request\n"
        f"{(user_question or '').strip()}\n\n"
        "### Output format\n"
        "Respond in GitHub-flavored Markdown, using the style rules. "
        "If the user asks for product recommendations, include up to 3 options with a short reason each.\n"
    )
