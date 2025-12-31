import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/articles`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getArticles = () => api.get('/');
export const getArticleById = (id) => api.get(`/${id}`);
export const createArticle = (data) => api.post('/', data);
export const updateArticle = (id, data) => api.put(`/${id}`, data);
export const deleteArticle = (id) => api.delete(`/${id}`);

export default api;
