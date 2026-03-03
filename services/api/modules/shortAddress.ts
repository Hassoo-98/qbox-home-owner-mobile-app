import api from '../config';
import { VerifyShortAddressPayload } from '../types';

export const verifyShortAddress = async (data: VerifyShortAddressPayload) => {
    const response = await api.post('/home_owner/verify-address', data);
    return response.data;
};
