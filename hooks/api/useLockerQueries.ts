import * as Locker from '@/services/api/modules/locker';
import { LinkLockerPayload } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLockers = () => {
    return useQuery({
        queryKey: ['lockers'],
        queryFn: Locker.listLockers,
    });
};

export const useLinkLocker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LinkLockerPayload) => Locker.linkLocker(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
        },
    });
};

export const useLockerStatus = (id: string) => {
    return useQuery({
        queryKey: ['locker-status', id],
        queryFn: () => Locker.getLockerStatus(id),
        enabled: !!id,
    });
};

export const useOpenLocker = () => {
    return useMutation({
        mutationFn: (lockerId: string) => Locker.openLocker(lockerId),
    });
};
