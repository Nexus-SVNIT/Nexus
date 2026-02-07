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
  (response) => response.data,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);


export default API;