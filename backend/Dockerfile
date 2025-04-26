# backend/Dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=api.py
ENV FLASK_DEBUG=1

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]