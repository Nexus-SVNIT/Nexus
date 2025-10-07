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
        }
    },
    (error) => {
        const message = error.response?.data?.message || 'Something went Wrong.';

        return {
            success: false,
            message,
        };
    }
);

export default API;