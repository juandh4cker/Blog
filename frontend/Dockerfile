# Usa una imagen Node estable
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./

RUN rm -rf node_modules

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto donde se ejecutará Vite
EXPOSE 5173

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
