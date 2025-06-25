# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only package files to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project (excluding files listed in .dockerignore)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Use production environment (optional best practice)
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/src/server.js"]
