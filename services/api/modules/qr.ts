import api from '../config';
import { GenerateQRPayload, QRHistoryItem, QRScanItem } from '../types';

export const generateQR = async (data: GenerateQRPayload) => {
    const response = await api.post('/qr/generate', data);
    return response.data;
};

export const getQRHistory = async (): Promise<QRHistoryItem[]> => {
    const response = await api.get('/qr/history');
    return response.data;
};

export const getQRScans = async (): Promise<QRScanItem[]> => {
    const response = await api.get('/qr/scans');
    return response.data;
};
