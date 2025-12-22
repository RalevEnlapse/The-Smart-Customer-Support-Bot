def answer_product_question(client, products, question, model: str = "openai.openai/gpt-5.2"):
    # Prepare context with product information
    context = "Here is the list of products:\n"
    for product in products:
        context += (
            f"- ID: {product['id']}, Name: {product['name']}, "
            f"Description: {product['description']}, Price: ${product['price']}, "
            f"Category: {product['category']}\n"
        )

    prompt = (
        f"{context}\n\nUser question: {question}\n\n"
        "Answer based on the products above. If its not related to the products, "
        "respond with 'I don't know its not related to the products' ."
    )

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
