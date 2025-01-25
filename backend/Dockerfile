# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install watchdog[watchmedo]

COPY . .

EXPOSE 5000

CMD ["watchmedo", "auto-restart", "--patterns=*.py;*.html", "--recursive", "--", "flask", "run", "--host=0.0.0.0"]
