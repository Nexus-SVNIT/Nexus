import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
});

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

API.interceptors.response.use(
    (response) => {
        return {
            success: true,
            data: response.data,
        };
    },
    (error) => {
       
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Logging out...");
            
            
            localStorage.removeItem('token');
            
            window.location.href = '/login'; 
            
           
            return {
                success: false,
                message: 'Session expired. Redirecting...',
            };
        }
    

        const message = error.response?.data?.message || 'Something went Wrong.';

        
        return {
            success: false,
            message,
        };
    }
);

export default API;