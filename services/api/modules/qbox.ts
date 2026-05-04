import api from '../config';
import { QBoxStreamsResponse, VerifyQBoxPayload } from '../types';

export const verifyQBoxId = async (data: VerifyQBoxPayload) => {
    const response = await api.post('/qbox/verify-id', data);
    return response.data;
};

export const getQBoxStreams = async (qbox_id: string): Promise<QBoxStreamsResponse> => {
    const response = await api.get<QBoxStreamsResponse>(`/devices/${qbox_id}/streams/`);
    return response.data;
};
