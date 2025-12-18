import json

def load_products():
    with open('../data/product.json', 'r') as f:
        return json.load(f)