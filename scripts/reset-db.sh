#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# PRISM – reset-db.sh
# ⚠  DESTRUCTIVE: drops all data, re-runs migrations, then seeds.
# Usage: bash scripts/reset-db.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ⚠  DATABASE RESET  –  ALL DATA LOST  ⚠    ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Safety prompt in interactive terminals
if [ -t 0 ]; then
  read -r -p "   Are you sure you want to reset the database? [y/N] " confirm
  case "${confirm}" in
    [yY][eE][sS]|[yY])
      echo ""
      ;;
    *)
      echo "   Aborted."
      exit 0
      ;;
  esac
fi

echo "▶  Resetting database schema ..."
docker compose exec backend npm run db:reset

echo ""
echo "▶  Seeding fresh data ..."
docker compose exec backend npm run db:seed

echo ""
echo "   ✔  Database reset and seeded successfully."
echo ""
