import * as Shipment from '@/services/api/modules/shipment';
import * as PaymentMethod from '@/services/api/modules/paymentMethod';
import * as ServiceProvider from '@/services/api/modules/serviceProvider';
import { useAuth } from '@/hooks/useAuth';
import {
    CreateShipmentRequest,
    GetPackageDetailsResponse,
    PaymentMethodsResponse,
    PackageListResponse,
    PackageTimelineItem,
    ReturnPackageRequest,
    ReturnPackageResponse,
    CreateShipmentResponse,
    ShipmentDetailResponse,
    ServiceProviderLookupResponse,
} from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const useIncomingPackages = () => {
    const { user } = useAuth();
    const homeOwnerId = user?.id;

    return useQuery<PackageListResponse>({
        queryKey: ['home-owner-incoming-packages', homeOwnerId],
        queryFn: () => Shipment.getIncomingPackages(homeOwnerId as string),
        enabled: !!homeOwnerId,
    });
};

export const useIncomingPackagesDetails = (id: string | number) => {
    return useQuery<ShipmentDetailResponse>({
        queryKey: ['shipment-details', id],
        queryFn: () => Shipment.getShipmentDetails(String(id)),
        enabled: !!id,
    });
};

export const useOutgoingPackages = () => {
    const { user } = useAuth();
    const homeOwnerId = user?.id;

    return useQuery<PackageListResponse>({
        queryKey: ['home-owner-outgoing-packages', homeOwnerId],
        queryFn: () => Shipment.getOutgoingPackages(homeOwnerId as string),
        enabled: !!homeOwnerId,
    });
};

export const useOutgoingPackagesDetails = (id: string | number) => {
    return useQuery<ShipmentDetailResponse | null>({
        queryKey: ['shipment-details-outgoing', id],
        queryFn: () => Shipment.getShipmentDetails(String(id)),
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
    return useMutation<CreateShipmentResponse, Error, CreateShipmentRequest>({
        mutationFn: Shipment.createShipment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-owner-outgoing-packages'] });
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
    });
};

export const usePaymentMethods = () => {
    return useQuery<PaymentMethodsResponse>({
        queryKey: ['payment-methods'],
        queryFn: PaymentMethod.getPaymentMethods,
    });
};

export const useServiceProviderLookup = () => {
    return useQuery<ServiceProviderLookupResponse>({
        queryKey: ['service-provider-lookup'],
        queryFn: () => ServiceProvider.lookupServiceProvider(),
    });
};

export const useReturnPackageMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<ReturnPackageResponse, Error, ReturnPackageRequest>({
        mutationFn: Shipment.returnPackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-owner-outgoing-packages'] });
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
    });
};

export const usePackageDetails = (id: string | number) => {
    const queryClient = useQueryClient();
    return useQuery<GetPackageDetailsResponse | null>({
        queryKey: ['package-details', id],
        queryFn: async () => {
            const queryKeys = [
                ['home-owner-incoming-packages'],
                ['home-owner-outgoing-packages'],
                ['delivered-packages'],
                ['packages']
            ];
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
            return null;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        initialData: () => {
            const queryKeys = [
                ['home-owner-incoming-packages'],
                ['home-owner-outgoing-packages'],
                ['delivered-packages'],
                ['packages']
            ];
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
