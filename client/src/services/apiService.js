import axios from "axios";

// Safety: Ensure we don't crash if the env var is missing (e.g. during local dev setup)
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const API = axios.create({
    baseURL: BASE_URL,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
API.interceptors.response.use(
    (response) => {
        // Keep your existing success structure
        return {
            success: true,
            data: response.data,
        }
    },
    (error) => {
        // 1. CAUTION: Check for 401 (Unauthorized) status
        // This happens when the token is expired or invalid
        if (error.response && error.response.status === 401) {
            
            // Only redirect if we actually have a token to clear (prevents loops on public pages)
            const token = localStorage.getItem('token');
            
            if (token) {
                console.warn("Session expired (401). Logging out...");
                
                // A. Remove the bad token
                localStorage.removeItem('token');
                
                // B. Force a hard redirect to Login
                // We use window.location because this file isn't a React component
                window.location.href = '/login';
            }
        }

        const message = error.response?.data?.message || 'Something went Wrong.';

        
        return {
            success: false,
            message,
        };
    }
);

export default API;