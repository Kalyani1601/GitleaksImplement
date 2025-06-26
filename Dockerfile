# Stage 1: Build Angular app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build Angular app (assumes Angular CLI is used)
RUN npm run build -- --output-path=dist

# Stage 2: Serve app using NGINX
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 and run NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
