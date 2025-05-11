import axios from 'axios';

// Define the base URL for your backend API
// const API_BASE_URL = 'http://localhost:8000/api/';
const API_BASE_URL = 'https://cf-refactor-backend.onrender.com';

export const fetchTopSubmissions = async (cf_id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}solutions/top-submissions/`, { cf_id });
        return response.data.urls;
    } catch (error) {
        console.error('Error fetching top submissions:', error);
        throw error;
    }
};

export const fetchCodeFromURL = async (url) => {
    try {
        const response = await axios.post(`${API_BASE_URL}solutions/fetch-code/`, { url });
        return response.data.code;
    } catch (error) {
        console.error('Error fetching code:', error);
        throw error;
    }
};

export const refactorCode = async (code, submission_url, cf_id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}solutions/refactor-code/`, { code, submission_url, cf_id });
        return response.data;
    } catch (error) {
        console.error('Error refactoring code:', error);
        throw error;
    }
};
