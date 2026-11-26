# ─────────────────────────────────────────────────────────────────
# PRISM Analysis Service – Dockerfile
# Python 3.11 slim + FastAPI + Uvicorn
# ─────────────────────────────────────────────────────────────────

FROM python:3.11-slim AS base

# Install system-level build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        curl \
        wget \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd --gid 1001 appgroup \
    && useradd  --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY --chown=appuser:appgroup . .

# Create log directory
RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

USER appuser

EXPOSE 8000

# --no-access-log reduces noise; remove it if you want request logs in stdout
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--log-level", "info"]
