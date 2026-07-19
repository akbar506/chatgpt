import axios from "./axiosConfig";
import { updateAccessToken, clearAccessToken } from "@/store/auth/authSlice";

let store;


export const injectStore = (_store) => {
    store = _store;
};

axios.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
)

axios.interceptors.response.use(
    (response) => response,
    async (error) => { // Using async here to allow for await inside the function
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry // Check if the request has already been retried
        ) {
            originalRequest._retry = true; // Mark the request as retried
        }
    }
)