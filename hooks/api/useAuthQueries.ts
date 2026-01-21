import { Colors } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import * as Auth from '@/services/api/modules/auth';
import { LoginPayload, RegisterPayload } from '@/services/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) => Auth.registerUser(data),
        onSuccess: (data) => {
            console.log("Registration Success Data:", JSON.stringify(data, null, 2));
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Something went wrong during registration';
            console.log("Registration Error Data:", JSON.stringify(error, null, 2));
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

export const useLogin = () => {
    const { login } = useAuth();

    return useMutation({
        mutationFn: (data: LoginPayload) => Auth.loginUser(data),
        onSuccess: (data) => {
            // API returns [{ message: "...", tokens: { ... } }, 200]
            console.log("Login Success Data:", JSON.stringify(data, null, 2));

            // content is in the first element if it's an array
            const responseData = Array.isArray(data) ? data[0] : data;
            const accessToken = responseData?.tokens?.access_token;

            if (accessToken) {
                login(accessToken);
                Toast.show({
                    type: "success",
                    text1: "Login successful",
                    position: "top",
                    backgroundColor: Colors.white,
                    textColor: Colors.text,
                    progressBarColor: Colors.success,
                    visibilityTime: 3000,
                });
            } else {
                const failureMessage = responseData?.message || "Login failed: Invalid server response";
                console.warn("Login success but no token. Message:", failureMessage);
                Toast.show({
                    type: "error",
                    text1: failureMessage,
                    position: "top",
                    backgroundColor: Colors.white,
                    textColor: Colors.text,
                    progressBarColor: Colors.danger,
                    visibilityTime: 3000,
                });
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
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

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: Auth.getUserProfile,
    });
};

export const useSendOtp = () => {
    return useMutation({
        mutationFn: (data: { contact: string }) => Auth.sendOtp(data),
        onSuccess: (data) => {
            console.log("Send OTP Success Data:", JSON.stringify(data, null, 2));
            Toast.show({
                type: "success",
                text1: "OTP sent successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP';
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

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: { contact: string, otp: string }) => {
            console.log("useVerifyOtp mutationFn called with payload:", data);
            return Auth.verifyOtp(data);
        },
        onSuccess: (data) => {
            console.log("Verify OTP Success Data:", JSON.stringify(data, null, 2));
            Toast.show({
                type: "success",
                text1: "OTP verified successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'OTP verification failed';
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
