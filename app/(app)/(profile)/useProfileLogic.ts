import { useUserProfile } from "@/hooks/api/useAuthQueries";

export const useProfileLogic = () => {
    const { data: profile, isLoading, error } = useUserProfile();

    return {
        profile,
        isLoading,
        error,
    };
};
