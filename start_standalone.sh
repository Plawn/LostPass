#!/bin/bash
echo "[WARN]: Using default config"
echo "Serving on port 5000"
echo "Requires redis to run on port 6379 on localhost"
uvicorn backend.app.api:app --reload --port 5000