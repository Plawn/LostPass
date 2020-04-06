#!/bin/bash
echo "[WARN]: Using default config"
echo "Serving on port 5000"
echo "Requires redis to run on port 6379 on localhost"
SELF_SERVED=true python3 backend/start.py 5000