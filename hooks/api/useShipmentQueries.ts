import * as Shipment from '@/services/api/modules/shipment';
import {
    GetPackageDetailsResponse,
    PackageListResponse,
    PackageTimelineItem,
    ReturnPackageRequest,
    ReturnPackageResponse,
    SendPackageRequest,
    SendPackageResponse,
} from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const useIncomingPackages = () => {
    return useQuery<PackageListResponse>({
        queryKey: ['incoming-packages'],
        queryFn: Shipment.getIncomingPackages,
    });
};

export const useIncomingPackagesDetails = (id: string | number) => {
    return useQuery<any>({
        queryKey: ['incoming-packages-details', id],
        queryFn: () => Shipment.getIncomingPackagesDetails(id),
        enabled: !!id,
    });
};

export const useOutgoingPackages = () => {
    return useQuery<PackageListResponse>({
        queryKey: ['outgoing-packages'],
        queryFn: Shipment.getOutgoingPackages,
    });
};

export const useOutgoingPackagesDetails = (id: string | number) => {
    return useQuery<any>({
        queryKey: ['outgoing-packages-details', id],
        queryFn: () => Shipment.getOutgoingPackagesDetails(id),
        enabled: !!id,
    });
};

export const useDeliveredPackages = () => {
    return useQuery<PackageListResponse>({
        queryKey: ['delivered-packages'],
        queryFn: Shipment.getDeliveredPackages,
    });
};

export const useDeliveredPackagesDetails = (id: string | number) => {
    return useQuery<any>({
        queryKey: ['delivered-packages-details', id],
        queryFn: () => Shipment.getDeliveredPackagesDetails(id),
        enabled: !!id,
    });
};

export const useSendPackageMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<SendPackageResponse, Error, SendPackageRequest>({
        mutationFn: Shipment.sendPackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outgoing-packages'] });
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
    });
};

export const useReturnPackageMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<ReturnPackageResponse, Error, ReturnPackageRequest>({
        mutationFn: Shipment.returnPackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outgoing-packages'] });
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
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
            const queryKeys = [['incoming-packages'], ['outgoing-packages'], ['delivered-packages'], ['packages']];
            for (const key of queryKeys) {
                const listData = queryClient.getQueryData<PackageListResponse>(key);
                const item = listData?.data.items.find(pkg => pkg.id === id);
                if (item) {
                    return {
                        success: true,
                        statusCode: 200,
                        data: item,
                        message: "Initial data from cache",
                    } as GetPackageDetailsResponse;
                }
            }
            return undefined;
        }
    });
};

export const usePackageTimeline = (id: string | number) => {
    return useQuery<PackageTimelineItem[]>({
        queryKey: ['package-timeline', id],
        queryFn: () => Shipment.getPackageTimeline(id),
        enabled: !!id,
    });
};
