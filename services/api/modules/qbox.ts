import api from '../config';
import { VerifyQBoxPayload } from '../types';

export const verifyQBoxId = async (data: VerifyQBoxPayload) => {
    const response = await api.post('/qbox/verify-id', data);
    return response.data;
};
