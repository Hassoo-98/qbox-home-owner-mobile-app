import * as QR from '@/services/api/modules/qr';
import { GenerateQRPayload } from '@/services/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGenerateQR = () => {
    return useMutation({
        mutationFn: (data: GenerateQRPayload) => QR.generateQR(data),
    });
};

export const useQRHistory = () => {
    return useQuery({
        queryKey: ['qr-history'],
        queryFn: QR.getQRHistory,
    });
};

export const useQRScans = () => {
    return useQuery({
        queryKey: ['qr-scans'],
        queryFn: QR.getQRScans,
    });
};
