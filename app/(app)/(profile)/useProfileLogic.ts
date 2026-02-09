import { useHomeOwner } from "@/hooks/useHomeOwner";

export const useProfileLogic = () => {
    const { data: homeOwnerResponse, isLoading, error } = useHomeOwner();
    const profile = homeOwnerResponse?.data;

    return {
        profile: profile ? {
            ...profile,
            phone: profile.phone_number, // Map phone_number to phone for compatibility
            avatar: profile.installation_qbox_image_url // Assuming avatar maps to this or check if avatar exists
        } : null,
        isLoading,
        error,
    };
};
