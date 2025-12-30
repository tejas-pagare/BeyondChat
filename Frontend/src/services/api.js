import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/articles',
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
