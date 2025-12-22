import json
import os


def load_products():
    """Load products regardless of current working directory."""
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    products_path = os.path.join(repo_root, "data", "product.json")

    with open(products_path, "r", encoding="utf-8") as f:
        return json.load(f)
