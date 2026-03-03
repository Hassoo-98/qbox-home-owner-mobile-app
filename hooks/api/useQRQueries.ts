import * as QR from '@/services/api/modules/qr';
import { CreateQRCodePayload, GenerateQRPayload, GetQRCodeDetailsResponse, QRHistoryResponse } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGenerateQR = () => {
    return useMutation({
        mutationFn: (data: GenerateQRPayload) => QR.generateQR(data),
    });
};

export const useCreateQRCode = () => {
    return useMutation({
        mutationFn: (data: CreateQRCodePayload) => QR.createQRCode(data),
    });
};

export const useQRHistory = () => {
    return useQuery({
        queryKey: ['qr-history'],
        queryFn: QR.getQRHistory,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useQRScans = () => {
    return useQuery({
        queryKey: ['qr-scans'],
        queryFn: QR.getQRScans,
    });
};

export const useQRCodeDetails = (id: string) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['qr-details', id],
        queryFn: () => QR.getQRCodeDetails(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        initialData: () => {
            const history = queryClient.getQueryData<QRHistoryResponse>(['qr-history']);
            const item = history?.results.find(res => res.id === id);
            if (item) {
                return {
                    success: true,
                    statusCode: 200,
                    data: {
                        ...item,
                        qbox_id: item.qbox_id,
                        name: item.name,
                        status: item.status,
                        created_at: item.created_at,
                        max_users: item.validforUsers,
                        remaining_users: item.validforUsers, // Placeholder
                        expiresIn: item.expiresIn,
                        duration_type: "", // Will be updated by real fetch
                        valid_duration: 0,
                        qr_code_image: "",
                    },
                    message: "Initial data from cache",
                } as unknown as GetQRCodeDetailsResponse;
            }
            return undefined;
        },
    });
};

export const useChangeQRStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => QR.changeQRStatus(id, status),
        onSuccess: () => {
            // Invalidate and refetch QR history to show updated status
            queryClient.invalidateQueries({ queryKey: ['qr-history'] });
        },
    });
};
