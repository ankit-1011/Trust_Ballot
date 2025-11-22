// API Configuration
// Local: http://localhost:3000
// Production: https://trust-ballot.onrender.com

const API_BASE_URL =
   "http://localhost:3000";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
};

export default API_ENDPOINTS;