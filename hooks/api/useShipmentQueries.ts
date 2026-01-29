import * as Shipment from '@/services/api/modules/shipment';
import { CreatePackageSendRequest } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePackages = () => {
    return useQuery({
        queryKey: ['packages'],
        queryFn: Shipment.listPackages,
    });
};

export const usePackageDetails = (id: string | number) => {
    return useQuery({
        queryKey: ['package-details', id],
        queryFn: () => Shipment.getPackageDetails(id),
        enabled: !!id,
    });
};

export const usePackageTimeline = (id: string | number) => {
    return useQuery({
        queryKey: ['package-timeline', id],
        queryFn: () => Shipment.getPackageTimeline(id),
        enabled: !!id,
    });
};

export const useCreateSendRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePackageSendRequest) => Shipment.createSendRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
    });
};

// Backward compatibility for createOrder
export const useCreateOrder = useCreateSendRequest;
