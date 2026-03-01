# Use Debian-based Node image instead of Alpine
FROM node:24-bookworm-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build frontend/backend if needed
RUN npm run build

# Expose the port your app runs on
EXPOSE 3006

# Start the appa
CMD ["npm", "start", "--", "-p", "3003"]
