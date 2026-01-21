import api from '../config';
import { LoginPayload, RegisterPayload, SendOtpPayload, VerifyOtpPayload } from '../types';

export const registerUser = async (data: RegisterPayload) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const loginUser = async (data: LoginPayload) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const sendOtp = async (data: SendOtpPayload) => {
    const response = await api.post('/auth/send_otp', data);
    return response.data;
};

export const verifyOtp = async (data: VerifyOtpPayload) => {
    const response = await api.post('/auth/verify_otp', data);
    return response.data;
};
