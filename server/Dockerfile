FROM node:24-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

EXPOSE 5006

CMD npx prisma generate && npx prisma migrate deploy && node src/index.js