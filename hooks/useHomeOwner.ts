import { getHomeOwner } from '@/services/api/homeOwner';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useHomeOwner = () => {
    const { user } = useAuth();
    const userId = user?.id;

    return useQuery({
        queryKey: ['homeOwner', userId],
        queryFn: () => getHomeOwner(userId!),
        enabled: !!userId,
    });
};
