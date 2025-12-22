from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Tuple

from flask import Flask, jsonify


@dataclass(frozen=True)
class ApiError(Exception):
    message: str
    status_code: int = 400
    code: str = "bad_request"


def json_error(message: str, status_code: int = 400, code: str = "bad_request"):
    return jsonify({"error": {"message": message, "code": code}}), status_code


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(e: ApiError) -> Tuple[Any, int]:
        return json_error(e.message, e.status_code, e.code)

    @app.errorhandler(Exception)
    def handle_unexpected_error(e: Exception) -> Tuple[Any, int]:
        app.logger.exception("Unhandled exception: %s", e)
        return json_error("Internal server error", 500, "internal_error")
