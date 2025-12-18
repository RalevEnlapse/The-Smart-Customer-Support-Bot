# Customer Service Bot

A simple customer service chatbot that answers questions about products using a cloud LLM and provides mock order status information.

## Features

- **Product Q&A**: Ask questions about available products, powered by an LLM with product data context.
- **Order Status**: Get mock status updates for orders by providing an order ID.
- **Interactive Chat**: Command-line interface for real-time interaction.

## Project Structure

```
3.1-OpenAiAgentsSDK/
├── data/
│   └── product.json          # JSON file containing product information
├── src/
│   ├── .env                  # Environment variables (API key)
│   ├── requirements.txt      # Python dependencies
│   ├── config.py             # Configuration and API client setup
│   ├── data_loader.py        # Loads product data from JSON
│   ├── services/
│   │   ├── order_service.py  # Handles order status logic
│   │   └── llm_service.py    # Handles LLM-based product question answering
│   ├── bot.py                # Chat loop and user interaction
│   └── main.py               # Entry point to run the bot
└── readme.md                 # This file
```

## Requirements

- Python 3.10+
- API key for Velocity (or compatible OpenAI-based service)

## Installation

1. Clone or download the project.
2. Navigate to the `src` directory:
   ```
   cd src
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up your API key in `.env`:
   ```
   VELOCITY_API_KEY=your_api_key_here
   ```

## Usage

1. From the `src` directory, run the bot:
   ```
   python main.py
   ```
2. Interact with the bot:
   - Ask questions like: "What products do you have?"
   - Check order status: "What is the status of order 12345?"
   - Type 'quit' to exit.

## Example Interaction

```
Ask a question about products or order status (type 'quit' to exit): What products do you have?
Based on the products, we have Wireless Headphones, Smartphone Case, and Laptop Stand.

Ask a question about products or order status (type 'quit' to exit): What is the status of order 12345?
Your order is being processed.

Ask a question about products or order status (type 'quit' to exit): quit
```

## Configuration

- **API Key**: Stored in `.env` for security. Update `VELOCITY_API_KEY` with your actual key.
- **Model**: Currently set to "openai.openai/gpt-5.2" in `llm_service.py`. Adjust if needed.
- **Products**: Edit `data/product.json` to add or modify product data.

## Contributing

Feel free to submit issues or pull requests for improvements.

## License

This project is for educational purposes. Ensure compliance with API terms of service.