import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const BASE_URL = 'http://69.62.125.223:5000';

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
            const token = await SecureStore.getItemAsync('userToken');
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
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with a status code other than 2xx
            if (error.response.status === 401) {
                // Handle unauthorized access (e.g., clear token and redirect to login)
                // Note: You might need a more robust way to navigate or clear state here
                console.warn('Unauthorized access. Token might be invalid.');
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
            Alert.alert('Network Error', 'Please check your internet connection.');
        } else {
            // Something happened in setting up the request
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
