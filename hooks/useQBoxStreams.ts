import { getQBoxStreams } from '@/services/api/modules/qbox';
import { useQuery } from '@tanstack/react-query';

export const useQBoxStreams = (qboxId: string) => {
    return useQuery({
        queryKey: ['qboxStreams', qboxId],
        queryFn: () => getQBoxStreams(qboxId),
        enabled: !!qboxId,
        refetchInterval: 30000, // Refetch every 30 seconds to keep streams fresh if needed
    });
};
