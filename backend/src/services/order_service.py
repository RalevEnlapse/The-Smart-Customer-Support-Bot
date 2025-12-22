def get_order_status(order_id):
    # Mock data for order status
    mock_statuses = {
        "12345": "Your order is being processed.",
        "67890": "Your order has been shipped and is on the way.",
        "11111": "Your order has been delivered.",
    }
    return mock_statuses.get(order_id, f"Order {order_id} not found.")
