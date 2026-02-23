import api from '../config';
import { CreateQRCodePayload, CreateQRCodeResponse, GenerateQRPayload, GetQRCodeDetailsResponse, QRHistoryResponse, QRScanItem } from '../types';

export const generateQR = async (data: GenerateQRPayload) => {
    const response = await api.post('/home_owner/qr/generate', data);
    return response.data;
};

export const createQRCode = async (data: CreateQRCodePayload): Promise<CreateQRCodeResponse> => {
    const response = await api.post<CreateQRCodeResponse>('/qbox/qr-codes/create', data);
    return response.data;
};

export const getQRHistory = async (): Promise<QRHistoryResponse> => {
    const response = await api.get<QRHistoryResponse>('/qbox/qr-codes/history');
    return response.data;
};

export const getQRScans = async (): Promise<QRScanItem[]> => {
    const response = await api.get('/home_owner/qr/scans');
    return response.data;
};

export const getQRCodeDetails = async (id: string): Promise<GetQRCodeDetailsResponse> => {
    const response = await api.get<GetQRCodeDetailsResponse>(`/qbox/qr-codes/${id}`);
    return response.data;
};
