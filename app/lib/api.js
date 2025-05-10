// app/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://server.thanmaihomefoods.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// you can add interceptors here if needed

export default api;
