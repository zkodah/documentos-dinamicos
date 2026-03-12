FROM node:20-slim

WORKDIR /srv/app

# Instala dependencias primero (capa cacheada)
COPY package*.json ./
RUN npm install

EXPOSE 1337

CMD ["npm", "run", "develop"]
