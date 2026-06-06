import * as HomeOwner from '@/services/api/homeOwner';
import { UpdateHomeOwnerRequest, UpdateHomeOwnerResponse } from '@/services/api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateHomeOwner = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<UpdateHomeOwnerResponse, Error, UpdateHomeOwnerRequest>({
        mutationFn: (data: UpdateHomeOwnerRequest) => HomeOwner.updateHomeOwner(id, data),
        onSuccess: (data) => {
            const nextHomeOwner = {
                success: data.success,
                statusCode: data.statusCode,
                data: data.data,
                message: data.message,
            };

            queryClient.setQueryData(['homeOwner', id], nextHomeOwner);
            queryClient.setQueriesData({ queryKey: ['homeOwner'] }, (current) => {
                if (!current || typeof current !== 'object') {
                    return nextHomeOwner;
                }

                return {
                    ...(current as Record<string, unknown>),
                    ...nextHomeOwner,
                };
            });
        },
    });
};
