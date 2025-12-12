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
export const getConstructorDriverStats = (id) => api.get(`/constructors/${id}/driver-stats`);
export const getRaces = (year) => {
    if (year) return api.get(`/races/season/${year}`);
    return api.get('/races');
};

// Analytics endpoints
export const getDNFCauses = () => api.get('/analytics/dnf-causes');
export const getPitStopEfficiency = (season) => {
    if (season) return api.get(`/analytics/pit-stops?season=${season}`);
    return api.get('/analytics/pit-stops');
};
export const getQualiVsRace = (driverId) => api.get(`/analytics/quali-vs-race?driverId=${driverId}`);

export default api;
