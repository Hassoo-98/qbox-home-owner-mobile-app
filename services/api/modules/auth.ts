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
    UpdateSettingsPayload,
    UserProfile,
    VerifyAddressPayload,
    VerifyOtpPayload,
    VerifyQBoxPayload
} from '../types';

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

export const updateProfileSettings = async (data: UpdateSettingsPayload) => {
    const response = await api.put('/profile/settings', data);
    return response.data;
};

export const changePassword = async (data: ChangePasswordPayload) => {
    const response = await api.post('/profile/change_password', data);
    return response.data;
};

export const checkUser = async (data: CheckUserPayload): Promise<CheckUserResponse> => {
    const response = await api.post('/auth/check_user', data);
    return response.data;
};

export const sendOtp = async (data: { contact: string }) => {
    const response = await api.post('/auth/send_otp', data);
    return response.data;
};

export const verifyOtp = async (data: VerifyOtpPayload) => {
    const response = await api.post('/auth/verify_otp', data);
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
    const response = await api.post('/auth/reset/initiate', data);
    return response.data;
};

export const resetPasswordVerify = async (data: ResetVerifyPayload) => {
    const response = await api.post('/auth/reset/verify', data);
    return response.data;
};

export const resetPasswordConfirm = async (data: ResetConfirmPayload) => {
    const response = await api.post('/auth/reset/confirm', data);
    return response.data;
};
