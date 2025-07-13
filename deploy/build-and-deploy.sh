#!/bin/bash

# Build and deploy React app to S3

# Set variables
S3_BUCKET="your-cooking-memo-bucket"
CLOUDFRONT_DISTRIBUTION_ID="your-cloudfront-distribution-id"
API_BASE_URL="http://your-ec2-public-ip:8000"

# Build the React app
echo "Building React application..."
npm run build

# Update API base URL in built files (if needed)
# This assumes you have an environment variable or config file
if [ -f "dist/assets/index-*.js" ]; then
    sed -i "s|http://localhost:8000|$API_BASE_URL|g" dist/assets/index-*.js
fi

# Deploy to S3
echo "Deploying to S3..."
aws s3 sync dist/ s3://$S3_BUCKET --delete

# Configure S3 bucket for static website hosting
aws s3 website s3://$S3_BUCKET --index-document index.html --error-document index.html

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
echo "Your app should be available at: https://your-cloudfront-domain.cloudfront.net"