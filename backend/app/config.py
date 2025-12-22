from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Settings:
    cors_origins: List[str]
    host: str
    port: int
    debug: bool

    @staticmethod
    def from_env() -> "Settings":
        origins_raw = os.getenv("CORS_ORIGINS", "*")
        cors_origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

        host = os.getenv("HOST", "127.0.0.1")
        port = int(os.getenv("PORT", "5000"))
        debug = os.getenv("FLASK_DEBUG", "1") in {"1", "true", "True"}

        return Settings(cors_origins=cors_origins, host=host, port=port, debug=debug)
