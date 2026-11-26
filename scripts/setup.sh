#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# PRISM – setup.sh
# Bootstraps the local dev environment and starts all services.
# Usage: bash scripts/setup.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║          PRISM  –  Setup & Launch            ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Environment file ──────────────────────────────────────────
if [ ! -f "${PROJECT_ROOT}/.env" ]; then
  echo "▶  .env not found – copying from .env.example ..."
  cp "${PROJECT_ROOT}/.env.example" "${PROJECT_ROOT}/.env"
  echo "   ✔  .env created."
  echo ""
  echo "   ⚠  IMPORTANT: Review and update ${PROJECT_ROOT}/.env"
  echo "      with your real secrets before running in production!"
  echo ""
else
  echo "▶  .env already exists – skipping copy."
fi

# ── 2. Build & start services ────────────────────────────────────
echo ""
echo "▶  Building Docker images and starting services ..."
echo "   (This may take a few minutes on first run)"
echo ""

docker compose --env-file "${PROJECT_ROOT}/.env" up --build -d

echo ""
echo "▶  Waiting for services to become healthy ..."
sleep 5

docker compose ps

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   PRISM is starting up!                      ║"
echo "║                                              ║"
echo "║   Frontend  → http://localhost:3000          ║"
echo "║   Backend   → http://localhost:4000          ║"
echo "║   Analysis  → http://localhost:8000          ║"
echo "║   Postgres  → localhost:5432                 ║"
echo "║   Redis     → localhost:6379                 ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "   Run 'docker compose logs -f' to tail all logs."
echo ""
