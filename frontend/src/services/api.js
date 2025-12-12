import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getDrivers = () => api.get('/drivers');
export const getConstructors = () => api.get('/constructors');
export const getConstructorById = (id) => api.get(`/constructors/${id}`);
export const getConstructorDrivers = (id) => api.get(`/constructors/${id}/drivers`);
export const getRaces = (year) => {
    if (year) return api.get(`/races/season/${year}`);
    return api.get('/races');
};

export default api;
