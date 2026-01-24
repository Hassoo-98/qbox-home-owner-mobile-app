import api from '../config';
import { Notification } from '../types';

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
};

export const sendAlert = async (data: { title: string; body: string; user_id: string }) => {
    const response = await api.post('/notify/send', data);
    return response.data;
};
