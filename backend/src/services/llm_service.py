from __future__ import annotations

from typing import Any, Dict, List

from backend.src.services.response_style import (
    build_conversation_context,
    build_products_context,
    build_user_prompt,
    support_agent_system_prompt,
)


def answer_product_question(
    client: Any,
    products: List[Dict[str, Any]],
    question: str,
    model: str = "openai.openai/gpt-5.2",
):
    """Answer product questions using a support-agent markdown contract."""

    products_md = build_products_context(products)

    # The router may pass question with history embedded already; keep it but also
    # provide structured recent transcript to the model when possible.
    # If the caller included a 'Conversation so far' block, it's harmless.
    user_md = build_user_prompt(question)

    system = support_agent_system_prompt()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"{products_md}\n\n{user_md}"},
        ],
    )

    return response.choices[0].message.content
