import * as Locker from '@/services/api/modules/locker';
import { CreateLockerPayload, UpdateLockerStatusPayload } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLockers = () => {
    return useQuery({
        queryKey: ['lockers'],
        queryFn: Locker.listLockers,
    });
};

export const useCreateLocker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLockerPayload) => Locker.createLocker(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
        },
    });
};

export const useOpenLocker = () => {
    return useMutation({
        mutationFn: (lockerId: string) => Locker.openLocker(lockerId),
    });
};

export const useUpdateLockerStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateLockerStatusPayload) => Locker.updateLockerStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
        },
    });
};
