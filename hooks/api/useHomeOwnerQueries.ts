import * as HomeOwner from '@/services/api/homeOwner';
import { UpdateHomeOwnerRequest, UpdateHomeOwnerResponse } from '@/services/api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateHomeOwner = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<UpdateHomeOwnerResponse, Error, UpdateHomeOwnerRequest>({
        mutationFn: (data: UpdateHomeOwnerRequest) => HomeOwner.updateHomeOwner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homeOwner', id] });
        },
    });
};
