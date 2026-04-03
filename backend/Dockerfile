# backend/Dockerfile

# --- Stage 1: Dependencies ---
FROM python:3.13-alpine AS deps
WORKDIR /app
RUN apk add --no-cache gcc musl-dev libffi-dev
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# --- Stage 2: Development ---
FROM python:3.13-alpine AS dev
WORKDIR /app
COPY --from=deps /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin
COPY . .
ENV FLASK_APP=api.py
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
