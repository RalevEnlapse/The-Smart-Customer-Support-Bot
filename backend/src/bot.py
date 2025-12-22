from backend.src.services.order_service import get_order_status
from backend.src.services.llm_service import answer_product_question


def run_bot(client, products):
    # Simple chat loop for the bot
    while True:
        user_input = input(
            "Ask a question about products or order status (type 'quit' to exit): "
        )
        if user_input.lower() == "quit":
            break
        if "order" in user_input.lower() and "status" in user_input.lower():
            # Extract order_id, assume it's the last word or something simple
            words = user_input.split()
            order_id = words[-1] if words else "unknown"
            print(get_order_status(order_id))
        else:
            print(answer_product_question(client, products, user_input))
