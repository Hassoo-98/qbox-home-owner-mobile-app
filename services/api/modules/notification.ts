import api from '../config';
import { AlertPayload } from '../types';

export const sendAlert = async (data: AlertPayload) => {
    const response = await api.post('/api/notify/send', data);
    return response.data;
};
