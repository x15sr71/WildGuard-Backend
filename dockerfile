# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container, including the .env file
COPY . .

# Ensure .env is available
RUN ls -la .env || echo ".env file is missing"

# Build TypeScript files
RUN npm run build

# Start the server
CMD ["node", "dist/src/server.js"]
