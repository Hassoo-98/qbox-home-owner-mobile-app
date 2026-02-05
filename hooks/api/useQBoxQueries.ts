import { Colors } from '@/constants';
import * as QBox from '@/services/api/modules/qbox';
import { VerifyQBoxPayload } from '@/services/api/types';
import { useMutation } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';

export const useVerifyQBoxId = () => {
    return useMutation({
        mutationFn: (data: VerifyQBoxPayload) => QBox.verifyQBoxId(data),
        onSuccess: (data) => {
            console.log("QBox Verification Success:", data);
            Toast.show({
                type: "success",
                text1: data.message || "QBox verified successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to verify QBox ID';
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
