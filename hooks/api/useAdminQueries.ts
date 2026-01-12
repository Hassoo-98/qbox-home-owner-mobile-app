import * as Admin from '@/services/api/modules/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSystemCheck = () => {
    return useQuery({
        queryKey: ['systemHealth'],
        queryFn: Admin.systemCheck,
    });
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['adminStats'],
        queryFn: Admin.getDashboardStats,
    });
};

export const useUserList = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: Admin.getUserList,
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => Admin.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
