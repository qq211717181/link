# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Create directory for database and uploads to ensure permissions
RUN mkdir -p server/uploads

# Copy server files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy server code
COPY server/ ./

# Copy built frontend from build stage
COPY --from=build /app/dist ../dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV SERVE_STATIC=true

EXPOSE 3001

CMD ["node", "server.js"]
