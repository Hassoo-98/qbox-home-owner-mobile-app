import api from '../config';
import { Offer, Subscription } from '../types';

export const getOffers = async (): Promise<Offer[]> => {
    const response = await api.get('/offers');
    return response.data;
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions');
    return response.data;
};
