# Use Debian-based Node image instead of Alpine
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package files first (cache layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema folder first
COPY prisma ./prisma

# Copy the rest of the project
COPY . .

# Expose backend port
EXPOSE 5006

# Run Prisma commands and start server
CMD npx prisma generate && npx prisma migrate deploy && node src/index.js
