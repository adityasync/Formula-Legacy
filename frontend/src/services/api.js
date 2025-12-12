import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
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
export const getPitStopEfficiency = (season) => api.get(`/analytics/pit-stops${season ? `?season=${season}` : ''}`);
export const getQualiVsRace = (driverId) => api.get(`/analytics/quali-vs-race?driverId=${driverId}`);

// New F1-Technical Analytics
export const getPoleToWin = () => api.get('/analytics/pole-to-win');
export const getGridPerformance = (season) => api.get(`/analytics/grid-performance?season=${season}`);
export const getQualifyingProgression = (season) => api.get(`/analytics/qualifying-progression?season=${season}`);
export const getFastestLaps = (season) => api.get(`/analytics/fastest-laps?season=${season}`);
export const getCircuitReliability = () => api.get('/analytics/circuit-reliability');
export const getPitStrategy = (circuitId) => api.get(`/analytics/pit-strategy${circuitId ? `?circuitId=${circuitId}` : ''}`);
export const getConstructorTrends = () => api.get('/analytics/constructor-trends');
export const getChampionshipBattle = (season) => api.get(`/analytics/championship-battle?season=${season}`);
export const getTeammateBattles = (season) => api.get(`/analytics/teammate-battles?season=${season}`);
export const getPointsEfficiency = (season) => api.get(`/analytics/points-efficiency?season=${season}`);

// Driver Profile endpoints
export const getDriverById = (id) => api.get(`/drivers/${id}`);
export const getDriverCareer = (id) => api.get(`/drivers/${id}/career`);
export const getDriverChampionships = (id) => api.get(`/drivers/${id}/championships`);
export const getDriverCircuits = (id) => api.get(`/drivers/${id}/circuits`);

// Circuit endpoints
export const getCircuits = () => api.get('/circuits');
export const getCircuitsWithStats = () => api.get('/circuits/with-stats');
export const getCircuitById = (id) => api.get(`/circuits/${id}`);
export const getCircuitStats = (id) => api.get(`/circuits/${id}/stats`);

export default api;
