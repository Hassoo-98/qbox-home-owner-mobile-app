import api from '../config';
import { CreateOrderPayload, UpdateOrderStatusPayload } from '../types';

export const createOrder = async (data: CreateOrderPayload) => {
    const response = await api.post('/api/shipment/create', data);
    return response.data;
};

export const trackOrder = async (trackingId: string) => {
    const response = await api.get(`/api/shipment/track/${trackingId}`);
    return response.data;
};

export const updateOrderStatus = async (trackingId: string, data: UpdateOrderStatusPayload) => {
    // Assuming the API expects the ID in the URL and status in the body
    // Or it could be PUT according to docs
    const response = await api.put(`/api/shipment/update/${trackingId}`, data);
    return response.data;
};
