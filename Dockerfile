FROM node:20-alpine

WORKDIR /app

# Define build arguments
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CURRENT_APP_BASE_URL
ARG NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL
ARG NEXT_PUBLIC_MAPPING_ID

# Set environment variables from build arguments
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_CURRENT_APP_BASE_URL=$NEXT_PUBLIC_CURRENT_APP_BASE_URL
ENV NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL=$NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL
ENV NEXT_PUBLIC_MAPPING_ID=$NEXT_PUBLIC_MAPPING_ID

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Make startup script executable
RUN chmod +x ./startup.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
