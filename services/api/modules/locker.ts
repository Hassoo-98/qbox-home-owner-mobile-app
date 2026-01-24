import api from '../config';
import { LinkLockerPayload, Locker, LockerStatusResponse } from '../types';

export const listLockers = async (): Promise<Locker[]> => {
    const response = await api.get('/lockers');
    return response.data;
};

export const linkLocker = async (data: LinkLockerPayload) => {
    const response = await api.post('/lockers/link', data);
    return response.data;
};

export const getLockerStatus = async (id: string): Promise<LockerStatusResponse> => {
    const response = await api.get(`/lockers/${id}/status`);
    return response.data;
};

export const openLocker = async (lockerId: string) => {
    // Postman shows GET /lockers/<id>/status and POST /locker/open
    // Based on the user's Postman (Home Owner folder):
    // POST /api/mobile/lockers/<id>/status might be used for opening if it's a command?
    // Actually, there is a global "open locker" in Postman root: POST /api/locker/open
    // But in Home Owner App folder, I don't see "open".
    // Wait, let me check line 562 again.
    const response = await api.post('/locker/open', { locker_id: lockerId });
    return response.data;
};

export const verifyQr = async (data: { qr_data: string }) => {
    const response = await api.post('/locker/verify_qr', data);
    return response.data;
};
