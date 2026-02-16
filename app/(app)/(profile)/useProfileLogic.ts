import { useHomeOwner } from "@/hooks/useHomeOwner";

export const useProfileLogic = () => {
    const { data: homeOwnerResponse, isLoading, error } = useHomeOwner();
    const profile = homeOwnerResponse?.data;

    return {
        profile: profile ? {
            ...profile,
            phone: profile.phone_number, // Map phone_number to phone for compatibility
        } : null,
        isLoading,
        error,
    };
};
