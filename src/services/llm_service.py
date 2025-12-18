def answer_product_question(client, products, question):
    # Prepare context with product information
    context = "Here is the list of products:\n"
    for product in products:
        context += f"- ID: {product['id']}, Name: {product['name']}, Description: {product['description']}, Price: ${product['price']}, Category: {product['category']}\n"
    
    prompt = f"{context}\n\nUser question: {question}\n\nAnswer based on the products above."
    
    response = client.chat.completions.create(
        model="openai.openai/gpt-5.2",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content