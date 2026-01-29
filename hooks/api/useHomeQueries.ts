import * as Home from '@/services/api/modules/home';
import { useQuery } from '@tanstack/react-query';

export const useOffers = () => {
    return useQuery({
        queryKey: ['offers'],
        queryFn: Home.getOffers,
    });
};

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: Home.getSubscriptions,
    });
};
