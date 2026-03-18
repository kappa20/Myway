FROM node:18-alpine

WORKDIR /app

# Build tools required to compile sqlite3 native bindings
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies (allow scripts so sqlite3 native bindings are compiled)
RUN npm install --production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
