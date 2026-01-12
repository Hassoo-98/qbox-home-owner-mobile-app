import api from '../config';
import { LoginPayload, RegisterPayload } from '../types';

export const registerUser = async (data: RegisterPayload) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
};

export const loginUser = async (data: LoginPayload) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
};
