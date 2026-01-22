import api from '../config';
import { CheckUserPayload, CheckUserResponse, LoginPayload, RegisterPayload, ResetPassword, SendOtpPayload, SendOtpPayloadForResetPassword, UserProfile, VerifyOtpPayload, VerifyOtpPayloadForResetPassword } from '../types';

export const registerUser = async (data: RegisterPayload) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const loginUser = async (data: LoginPayload) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/profile');
    return response.data;
};

export const checkUser = async (data: CheckUserPayload): Promise<CheckUserResponse> => {
    const response = await api.post('/auth/check_user', data);
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

export const sendOtpForResetPassword = async (data: SendOtpPayloadForResetPassword) => {
    const response = await api.post('/auth/reset/initiate', data);
    return response.data;
};


export const verifyOtpForResetPassword = async (data: VerifyOtpPayloadForResetPassword) => {
    const response = await api.post('/auth/reset/verify', data);
    return response.data;
};

export const resetPassword = async (data: ResetPassword) => {
    const response = await api.post('/auth/reset/confirm', data);
    return response.data;
};
