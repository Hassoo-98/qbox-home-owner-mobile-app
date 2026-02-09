import * as Shipment from '@/services/api/modules/shipment';
import { CreatePackageSendRequest, GetPackageDetailsResponse, PackageListResponse } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePackages = () => {
    return useQuery<PackageListResponse>({
        queryKey: ['packages'],
        queryFn: Shipment.listPackages,
    });
};

export const usePackageDetails = (id: string | number) => {
    const queryClient = useQueryClient();
    return useQuery<GetPackageDetailsResponse>({
        queryKey: ['package-details', id],
        queryFn: () => Shipment.getPackageDetails(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        initialData: () => {
            const listData = queryClient.getQueryData<PackageListResponse>(['packages']);
            const item = listData?.data.items.find(pkg => pkg.id === id);
            if (item) {
                return {
                    success: true,
                    statusCode: 200,
                    data: item,
                    message: "Initial data from cache",
                } as GetPackageDetailsResponse;
            }
            return undefined;
        }
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
