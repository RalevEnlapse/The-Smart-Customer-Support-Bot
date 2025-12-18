from config import get_client
from data_loader import load_products
from bot import run_bot

if __name__ == "__main__":
    client = get_client()
    products = load_products()
    run_bot(client, products)