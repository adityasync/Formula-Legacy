import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Create user-friendly error messages
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 400:
                    errorMessage = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    errorMessage = 'Session expired. Please refresh the page.';
                    break;
                case 403:
                    errorMessage = 'Access denied.';
                    break;
                case 404:
                    errorMessage = 'The requested data was not found.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                case 503:
                    errorMessage = 'Service temporarily unavailable. Please try again.';
                    break;
                default:
                    errorMessage = `Server error (${error.response.status})`;
            }
        } else if (error.request) {
            // Request made but no response received
            errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timed out. Please try again.';
        }

        // Attach user-friendly message to error object
        error.userMessage = errorMessage;

        // Log for debugging (can be sent to monitoring service)
        console.error('[API Error]', {
            url: error.config?.url,
            status: error.response?.status,
            message: errorMessage
        });

        return Promise.reject(error);
    }
);

// Helper to get latest season (cached for performance)
let cachedLatestSeason = null;
export const getLatestSeason = async () => {
    if (cachedLatestSeason) return cachedLatestSeason;
    try {
        const res = await api.get('/races/latest-season');
        cachedLatestSeason = res.data;
        return cachedLatestSeason;
    } catch {
        // Fallback to current year if endpoint fails
        return new Date().getFullYear();
    }
};

export const getDrivers = () => api.get('/drivers');
export const getConstructors = (search) => api.get('/constructors', { params: { search } });
export const getConstructorsWithStats = () => api.get('/constructors/stats');
export const getConstructorById = (id) => api.get(`/constructors/${id}`);
export const getConstructorDrivers = (id) => api.get(`/constructors/${id}/drivers`);
export const getConstructorDriverStats = (id) => api.get(`/constructors/${id}/driver-stats`);
export const getConstructorSeasons = (id) => api.get(`/constructors/${id}/seasons`);
export const getConstructorCircuits = (id) => api.get(`/constructors/${id}/circuits`);

export const getConstructorDashboardStats = (id) => api.get(`/constructors/${id}/dashboard-stats`);
export const getConstructorStatusBreakdown = (id) => api.get(`/constructors/${id}/status-breakdown`);
export const getConstructorPointsHeatmap = (id) => api.get(`/constructors/${id}/points-heatmap`);
export const getConstructorGeoPerformance = (id) => api.get(`/constructors/${id}/geo-performance`);

export const getRaces = (year) => {
    if (year) return api.get(`/races/season/${year}`);
    return api.get('/races');
};

// Analytics endpoints (Live Spring Boot Backend)
export const getDNFCauses = () => api.get('/analytics/dnf-causes');
export const getPoleToWin = () => api.get('/analytics/pole-to-win');
export const getHeadToHeadLive = (d1, d2) => api.get(`/analytics/head-to-head?driver1Id=${d1}&driver2Id=${d2}`);
// Driver stats for HeadToHead comparison - now using backend endpoint
export const getDriverStats = () => api.get('/drivers/stats');
export const getHeadToHead = () => api.get('/drivers/stats'); // Replaced static JSON with backend API

export const getPitStopEfficiency = (season) => api.get(`/analytics/pit-stops?season=${season}`);
export const getPitStopTeamEfficiency = (season) => api.get(`/analytics/pit-stop-team-efficiency?season=${season}`);
export const getPitStrategyStats = (season) => api.get(`/analytics/pit-strategy-stats?season=${season}`);
export const getLapConsistency = (season) => api.get(`/analytics/lap-consistency?season=${season}`);
export const getRacePaceGap = (season) => api.get(`/analytics/race-pace-gap?season=${season}`);
export const getQualifyingProgression = (season) => api.get(`/analytics/qualifying-progression?season=${season}`);
export const getFastestLaps = (season) => api.get(`/analytics/fastest-laps?season=${season}`);
export const getTeammateBattles = (season) => api.get(`/analytics/teammate-battles?season=${season}`);
export const getPointsEfficiency = (season) => api.get(`/analytics/points-efficiency?season=${season}`);
export const getGridPerformance = (season) => api.get(`/analytics/grid-performance?season=${season}`);
export const getChampionshipBattle = (season) => api.get(`/analytics/championship-battle?season=${season}`);
export const getConstructorChampionship = (season) => api.get(`/analytics/constructor-championship?season=${season}`);
export const getConstructorTrends = () => api.get('/analytics/constructor-trends');
export const getCircuitReliability = () => api.get('/analytics/circuit-reliability');
export const getChampionshipMomentum = (season) => api.get(`/analytics/championship-momentum?season=${season}`);
export const getSeasonDominance = (season) => api.get(`/analytics/season-dominance?season=${season}`);


// Driver Profile endpoints
export const getDriverById = (id) => api.get(`/drivers/${id}`);
export const getDriverCareer = (id) => api.get(`/drivers/${id}/career`);
export const getDriverChampionships = (id) => api.get(`/drivers/${id}/championships`);
export const getDriverCircuits = (id) => api.get(`/drivers/${id}/circuits`);
export const getDriverEvolution = (id) => api.get(`/drivers/${id}/evolution`);
export const getDriverFinishingStatus = (id) => api.get(`/drivers/${id}/status`);
export const getDriverTeammateBattles = (id) => api.get(`/drivers/${id}/teammates`);
export const getDriverCareerTrajectory = (id) => api.get(`/drivers/${id}/trajectory`);
export const getDriverFinishingPositions = (id) => api.get(`/drivers/${id}/positions`);

// Circuit endpoints
export const getCircuits = () => api.get('/circuits');
export const getCircuitsWithStats = () => api.get('/circuits/with-stats');
export const getCircuitById = (id) => api.get(`/circuits/${id}`);
export const getCircuitStats = (id) => api.get(`/circuits/${id}/stats`);

export default api;
