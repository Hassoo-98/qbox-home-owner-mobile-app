import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://backend.qbox.sa';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving token', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshTokenValue = await SecureStore.getItemAsync('refresh_token');

                if (!refreshTokenValue) {
                    // No refresh token, force logout or handle error
                    return Promise.reject(error);
                }

                // Call refresh token API
                // We need to import axios directly to avoid circular dependency if api uses this interceptor
                // ensuring the refresh call itself doesn't loop
                const response = await axios.post(`${BASE_URL}/auth/token/refresh`, {
                    refresh: refreshTokenValue,
                });

                const { access, refresh } = response.data; // Adjust based on actual response structure

                if (access) {
                    await SecureStore.setItemAsync('token', access);
                    // Optionally update refresh token if a new one is returned
                    if (refresh) {
                        await SecureStore.setItemAsync('refresh_token', refresh);
                    }

                    api.defaults.headers.common['Authorization'] = 'Bearer ' + access;
                    originalRequest.headers['Authorization'] = 'Bearer ' + access;

                    processQueue(null, access);
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                // Clear tokens on refresh failure
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('refresh_token');
                // You might want to redirect to login here using a navigation service or event
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
