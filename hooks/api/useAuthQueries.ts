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
            console.log("Login Success Data:", JSON.stringify(data, null, 2));

            // Content is in 'token' field directly in new API structure
            const responseData = Array.isArray(data) ? data[0] : data;
            const accessToken = responseData?.token;

            if (accessToken) {
                login(accessToken);
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


export const useSendOtpForResetPassword = () => {
    return useMutation({
        mutationFn: (data: { contact: string; method: string }) => Auth.sendOtpForResetPassword(data),
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

export const useVerifyOtpForResetPassword = () => {
    return useMutation({
        mutationFn: (data: { otp: string }) => {
            console.log("useVerifyOtpForResetPassword mutationFn called with payload:", data);
            return Auth.verifyOtpForResetPassword(data);
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


export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: { uid: string; new_password: string }) => {
            console.log("this is the new password", data.new_password);

            // CALL the API
            return Auth.resetPassword(data);
        },

        onSuccess: () => {
            console.log("Change password successfully");
        },

        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                "Change password operation failed";

            Toast.show({
                type: "error",
                text1: errorMessage,
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        },
    });
};


export const useCheckUser = () => {
    return useMutation({
        mutationFn: (data: { email: string }) => Auth.checkUser(data),
        onSuccess: (data) => {
            console.log("Check User Success Data:", JSON.stringify(data, null, 2));
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to check user';
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
