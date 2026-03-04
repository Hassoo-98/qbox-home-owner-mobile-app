import api from '../config';
import { Offer, PromotionDetailResponse, Subscription } from '../types';

export const getOffers = async (): Promise<Offer[]> => {
    const response = await api.get('/promotion/');
    return response.data.data.items;
};

export const getPromotionById = async (id: string): Promise<PromotionDetailResponse> => {
    const response = await api.get(`/promotion/${id}/`);
    return response.data;
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
    const response = await api.get('/home_owner/subscriptions');
    return response.data;
};
