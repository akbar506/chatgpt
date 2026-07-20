import axios from "./axiosConfig"
import { refreshAccessToken } from "@/api/refreshAccessToken";
import { removeUser, loadUser } from "@/store/user/userSlice"

import {
    updateAccessToken,
    clearAccessToken,
} from "../store/auth/authSlice";
import { logout } from "@/api/logout";

let store = null;

export const injectStore = (_store) => {
    store = _store;
};

/* Refresh Queue */

let isRefreshing = false;

let failedQueue = [];

/* Resolve waiting requests */

const processQueue = (error, token = null) => {
    // Resolve or reject all promises in the failedQueue based on whether there was an error or a new token was obtained
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

/* Request Interceptor */

axios.interceptors.request.use(
    (config) => {

        const token = store?.getState()?.auth?.accessToken; // Access the token from the Redux store

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },

    (error) => Promise.reject(error)
);

/* Response Interceptor */

axios.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (!error.response) {
            return Promise.reject(error);
        }

        // If the error is not a 401 Unauthorized or if the request has already been retried, reject the promise
        if (
            error.response.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        /* Refresh already running? */

        if (isRefreshing) {
            // If a token refresh is already in progress, queue the request and wait for the new token
            return new Promise((resolve, reject) => {
                // Add the current request's resolve and reject functions to the failedQueue
                failedQueue.push({
                    resolve,
                    reject,
                });

            }).then((token) => {

                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return axios(originalRequest); // Retry the original request with the new token

            });

        }

        isRefreshing = true;

        try {

            const {accessToken, user} =
                await refreshAccessToken();

            store.dispatch(
                updateAccessToken(accessToken)
            );
            store.dispatch(loadUser(user));

            // Resolve all queued requests with the new token
            processQueue(null, accessToken);

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return axios(originalRequest);

        } catch (err) {

            // If the token refresh fails, reject all queued requests and log the user out
            processQueue(err, null);

            store.dispatch(clearAccessToken());
            store.dispatch(removeUser());
            await logout(); // Call the logout API
            
            // Redirect to the login page
            window.location.href = "/login";
            
            return Promise.reject(err);

        } finally {

            isRefreshing = false;

        }

    }

);