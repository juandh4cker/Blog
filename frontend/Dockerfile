# frontend/Dockerfile
FROM node:24-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm install -g nodemon

COPY . .

EXPOSE 5173

CMD ["nodemon", "--watch", ".", "--ext", "js,jsx,ts,tsx,css,json", "--exec", "npm run dev -- --host"]