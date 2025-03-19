#!/bin/sh

# Print environment variables for debugging
echo "============= ENVIRONMENT VARIABLES ============="
echo "NEXT_PUBLIC_API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"
echo "NEXT_PUBLIC_CURRENT_APP_BASE_URL: $NEXT_PUBLIC_CURRENT_APP_BASE_URL"
echo "NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL: $NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL"
echo "NEXT_PUBLIC_MAPPING_ID: $NEXT_PUBLIC_MAPPING_ID"
echo "==============================================="

# Export Azure App Service environment variables for Next.js
export NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
export NEXT_PUBLIC_CURRENT_APP_BASE_URL=$NEXT_PUBLIC_CURRENT_APP_BASE_URL
export NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL=$NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL
export NEXT_PUBLIC_MAPPING_ID=$NEXT_PUBLIC_MAPPING_ID

# Confirm exports were successful
echo "Environment variables have been exported to the application"

# Start the application
echo "Starting Next.js application..."
npm start 