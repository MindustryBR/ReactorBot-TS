#!/bin/bash
set -e

cd "$(dirname "$0")"

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[UPDATE] Mudança detectada, atualizando..."

  git pull origin main
  docker compose build
  docker compose up -d
else
  echo "[UPDATE] Nenhuma mudança"
fi
