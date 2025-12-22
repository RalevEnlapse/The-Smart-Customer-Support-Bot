# Customer Service Bot

A simple customer service chatbot that answers questions about products using a cloud LLM and provides mock order status information.

## Features

- **Product Q&A**: Ask questions about available products, powered by an LLM with product data context.
- **Order Status**: Get mock status updates for orders by providing an order ID.
- **Interactive Chat**: Command-line interface for real-time interaction.
- **Web UI (local)**: Next.js chat frontend talking to a Flask backend API.

## Project Structure

```
3.2 - Smart Customer Support Bot/
├── data/
│   └── product.json                 # Product information
├── backend/
│   ├── requirements.txt             # Backend dependencies
│   ├── wsgi.py                      # Backend entrypoint
│   ├── app/                         # Flask app package
│   │   ├── api/routes.py            # /api/* routes
│   │   ├── stores/session_store.py  # In-memory sessions (swappable later)
│   │   └── utils/errors.py          # Consistent JSON errors
│   └── src/                         # Domain logic (moved from old top-level src/)
│       ├── config.py
│       ├── data_loader.py
│       └── services/
└── web/                             # Next.js frontend
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

### CLI (original)

1. From the `src` directory, run the bot:
   ```
   python main.py
   ```
2. Interact with the bot:
   - Ask questions like: "What products do you have?"
   - Check order status: "What is the status of order 12345?"
   - Type 'quit' to exit.

### Web (local)

#### 1) Backend (Flask)

From the repo root:

```
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements.txt
```

Set your API key (copy the example):
- Copy [`web/.env.local.example`](web/.env.local.example:1) → `web/.env.local` (optional)
- Create `backend/src/.env` with:

```
VELOCITY_API_KEY=your_api_key_here
```

Run the backend:

```
python backend/wsgi.py
```

Backend will listen on `http://127.0.0.1:5000`.

#### 1-click run (Windows)

After you’ve created the `.venv` and installed dependencies, you can start both backend + frontend using:

- [`run_all.cmd`](run_all.cmd:1)

#### 2) Frontend (Next.js)

From the repo root:

```
cd web
npm install
```

(Optional) configure backend URL:
- Copy [`web/.env.local.example`](web/.env.local.example:1) → `web/.env.local`

Run Next.js:

```
npm run dev
```

Open `http://localhost:3000`.

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