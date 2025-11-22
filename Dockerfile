# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 3000 for NestJS
EXPOSE 3000

# Start the app in development mode (hot reload)
CMD ["npm", "run", "start:dev"]
