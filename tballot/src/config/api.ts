// API Configuration
// For local development, use: http://localhost:3000
// For production, use: https://trust-ballot.onrender.com

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
};

export default API_ENDPOINTS;

