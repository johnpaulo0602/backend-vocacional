# Use the official Node.js image
FROM node:20.13.1

# Create and change to the app directory
WORKDIR /app

# Install Prisma CLI globally
RUN npm install -g prisma

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local code to the container image.
COPY . .

# Copy .env file
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Set environment variables
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Run the web service on container startup.
CMD [ "node", "index.js" ]
