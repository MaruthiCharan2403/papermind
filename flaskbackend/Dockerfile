FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN python -m pip install --upgrade --no-cache-dir pip && \
    pip install --no-cache-dir torch==2.7.0 --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ChromaDB will store data in ./chroma_db
# Mount a volume to persist data: -v $(pwd)/chroma_db:/app/chroma_db

CMD ["python", "app.py"]