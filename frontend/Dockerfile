# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm install -g nodemon

COPY . .

EXPOSE 5173

CMD ["nodemon", "--watch", ".", "--ext", "js,jsx,ts,tsx,css,json", "--exec", "npm run dev -- --host"]