import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('bb_token');
    if (token) config.headers.Authorization = token;
    return config;
});

// ─── Auth ───────────────────────────────────────────
export const register = (data) => API.post('/api/users/register', data);
export const login = (data) => API.post('/api/users/login', data);

// ─── Expenses ───────────────────────────────────────
export const getExpenses = () => API.get('/api/expenses');
export const addExpense = (data) => API.post('/api/expenses', data);
export const deleteExpense = (id) => API.delete(`/api/expenses/${id}`);
