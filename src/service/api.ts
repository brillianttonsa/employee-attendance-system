import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// Ensure frontend talks to backend API prefix
const api = axios.create({
    baseURL: BASE.endsWith('/api') ? BASE : `${BASE}/api`,
    withCredentials: true,
})

export default api;