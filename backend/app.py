"""Legacy entrypoint.

Backend has moved to an application factory in backend/app.

Run the new backend with:
- python backend/wsgi.py
or
- python -m flask --app backend.wsgi run
"""

from backend.wsgi import app  # noqa: F401
