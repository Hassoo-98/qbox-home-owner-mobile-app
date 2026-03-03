import { Colors } from '@/constants';
import * as ShortAddress from '@/services/api/modules/shortAddress';
import { VerifyShortAddressPayload } from '@/services/api/types';
import { useMutation } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';

export const useVerifyShortAddress = (options?: { onSuccess?: (data: any) => void }) => {
    return useMutation({
        mutationFn: (data: VerifyShortAddressPayload) => ShortAddress.verifyShortAddress(data),
        onSuccess: (data) => {
            console.log("QBox Verification Success:", data);
            Toast.show({
                type: "success",
                text1: data.message || "Short address verified successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
            // Call the optional onSuccess callback passed from the component
            options?.onSuccess?.(data);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to verify short address';
            Toast.show({
                type: "error",
                text1: errorMessage,
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        }
    });
};
