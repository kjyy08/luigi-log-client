import axios from 'axios';
import { API_BASE_URL } from '@/shared/config';

export const publicApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookie-based auth (Refresh Token)
});

// Request Interceptor: No longer needed for Token Injection (Cookie-based)
publicApi.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);


publicApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling (e.g. logging)
        return Promise.reject(error);
    }
);
