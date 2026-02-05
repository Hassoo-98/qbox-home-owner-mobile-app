import api from '../config';
import { Offer, Subscription } from '../types';

export const getOffers = async (): Promise<Offer[]> => {
    const response = await api.get('/home_owner/offers');
    return response.data;
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
    const response = await api.get('/home_owner/subscriptions');
    return response.data;
};
