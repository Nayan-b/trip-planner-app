FROM python:3.13-slim

WORKDIR /app

# Install system dependencies needed for GeoAlchemy2/PostGIS (e.g., libgeos-dev if needed, but wheel usually suffices. psycopg2-binary handles postgres driver)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user for security
RUN useradd -m appuser
USER appuser

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
