import * as Home from '@/services/api/modules/home';
import { useQuery } from '@tanstack/react-query';

export const useOffers = () => {
    return useQuery({
        queryKey: ['offers'],
        queryFn: Home.getOffers,
    });
};

export const usePromotionDetail = (id: string) => {
    return useQuery({
        queryKey: ['promotion', id],
        queryFn: () => Home.getPromotionById(id),
        enabled: !!id,
    });
};

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: Home.getSubscriptions,
    });
};
