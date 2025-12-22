from backend.src.config import get_client
from backend.src.data_loader import load_products
from backend.src.bot import run_bot


if __name__ == "__main__":
    client = get_client()
    products = load_products()
    run_bot(client, products)
