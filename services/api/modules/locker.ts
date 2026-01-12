import api from '../config';
import { CreateLockerPayload, UpdateLockerStatusPayload, VerifyQrPayload } from '../types';

export const createLocker = async (data: CreateLockerPayload) => {
    const response = await api.post('/api/locker/create', data);
    return response.data;
};

export const listLockers = async () => {
    const response = await api.get('/api/locker/list');
    return response.data;
};

export const openLocker = async (lockerId: string) => {
    const response = await api.post('/api/locker/open', { locker_id: lockerId });
    return response.data;
};

export const updateLockerStatus = async (data: UpdateLockerStatusPayload) => {
    const response = await api.post('/api/locker/update', data);
    return response.data;
};

export const verifyQr = async (data: VerifyQrPayload) => {
    const response = await api.post('/api/locker/verify_qr', data);
    return response.data;
};
