#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# PRISM – seed.sh
# Seeds the database with initial / demo data.
# Usage: bash scripts/seed.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}"

echo ""
echo "▶  Seeding the PRISM database ..."
echo ""

docker compose exec backend npm run db:seed

echo ""
echo "   ✔  Database seeded successfully."
echo ""
