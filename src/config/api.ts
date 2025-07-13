// API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// For production deployment, set VITE_API_BASE_URL environment variable
// Example: VITE_API_BASE_URL=http://your-ec2-public-ip:8000