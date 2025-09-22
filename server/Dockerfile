FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma



COPY . .

EXPOSE 5006

CMD npx prisma generate && npx prisma migrate deploy && node src/index.js 