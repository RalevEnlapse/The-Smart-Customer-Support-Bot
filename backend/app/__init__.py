from __future__ import annotations

from flask import Flask

from .config import Settings
from .extensions import cors
from .api.routes import api
from .utils.errors import register_error_handlers


def create_app(settings: Settings | None = None) -> Flask:
    """Flask application factory."""

    app = Flask(__name__)

    settings = settings or Settings.from_env()
    app.config["SCSB_SETTINGS"] = settings

    cors.init_app(app, resources={r"/api/*": {"origins": settings.cors_origins}})

    app.register_blueprint(api)
    register_error_handlers(app)

    return app
