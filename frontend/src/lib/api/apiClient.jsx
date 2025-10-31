import axios from "axios";
import useAuthStore from "../store/authStore";

const API_URL = "https://finance-api-5xhs.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Authorization header
api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response or Request interceptors to add the token
export default api;