import api from '../config';
import {
    ChangePasswordPayload,
    CheckUserPayload,
    CheckUserResponse,
    LoginPayload,
    RegisterPayload,
    ResetConfirmPayload,
    ResetInitiatePayload,
    ResetVerifyPayload,
    SendOtpPayload,
    UpdateSettingsPayload,
    UserProfile,
    VerifyAddressPayload,
    VerifyOtpPayload,
    VerifyQBoxPayload
} from '../types';

export const registerUser = async (data: RegisterPayload) => {
    const response = await api.post('/home_owner/create', data);
    return response.data;
};

export const loginUser = async (data: LoginPayload) => {
    const response = await api.post('/home_owner/login', data);
    return response.data;
};

export const logoutHomeOwner = async () => {
    const response = await api.post('/home_owner/logout');
    return response.data;
};

export const refreshToken = async (refresh: string) => {
    const response = await api.post('/auth/token/refresh', { refresh });
    return response.data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/home_owner/profile');
    return response.data;
};

export const updateProfileSettings = async (data: UpdateSettingsPayload) => {
    const response = await api.put('/home_owner/profile/settings', data);
    return response.data;
};

export const changePassword = async (data: ChangePasswordPayload) => {
    const { id, ...payload } = data;
    const response = await api.post(`/home_owner/${id}/change-password`, payload);
    return response.data;
};

export const checkUser = async (data: CheckUserPayload): Promise<CheckUserResponse> => {
    const response = await api.post('/auth/check_user', data);
    return response.data;
};

export const sendOtp = async (data: SendOtpPayload) => {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
};

export const verifyOtp = async (data: VerifyOtpPayload) => {
    const response = await api.post('/auth/otp-verify', data);
    return response.data;
};

export const verifyQBox = async (data: VerifyQBoxPayload) => {
    const response = await api.post('/auth/verify_qbox', data);
    return response.data;
};

export const verifyAddress = async (data: VerifyAddressPayload) => {
    const response = await api.post('/auth/verify_address', data);
    return response.data;
};

export const resetPasswordInitiate = async (data: ResetInitiatePayload) => {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
};

export const resetPasswordVerify = async (data: ResetVerifyPayload) => {
    const response = await api.post('/auth/reset/verify', data);
    return response.data;
};

export const resetPasswordConfirm = async (data: ResetConfirmPayload) => {
    const response = await api.post('/home_owner/reset-password', data);
    return response.data;
};
