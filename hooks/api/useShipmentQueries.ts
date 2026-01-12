import * as Shipment from '@/services/api/modules/shipment';
import { CreateOrderPayload, UpdateOrderStatusPayload } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (data: CreateOrderPayload) => Shipment.createOrder(data),
    });
};

export const useTrackOrder = (trackingId: string) => {
    return useQuery({
        queryKey: ['shipment', trackingId],
        queryFn: () => Shipment.trackOrder(trackingId),
        enabled: !!trackingId,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusPayload }) =>
            Shipment.updateOrderStatus(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['shipment', id] });
        },
    });
};
