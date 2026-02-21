// Backend API Configuration
export const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://bus-full-aa-backend.vercel.app'; // Replace with your actual backend URL
