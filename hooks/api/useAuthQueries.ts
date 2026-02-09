import { Colors } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import * as Auth from '@/services/api/modules/auth';
import {
    ChangePasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetConfirmPayload,
    ResetInitiatePayload,
    UpdateSettingsPayload,
    VerifyAddressPayload,
    VerifyQBoxPayload
} from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
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

            // Content is in 'data.access' field in new API structure
            const responseData = Array.isArray(data) ? data[0] : data;
            const access = responseData?.data?.access || responseData?.token;
            const refresh = responseData?.data?.refresh;

            if (access && refresh && responseData?.data?.user) {
                login({
                    tokens: { access, refresh },
                    user: responseData.data.user
                });
            } else if (access && responseData?.data?.user) {
                // Fallback if only access token is present
                login({
                    tokens: { access, refresh: '' },
                    user: responseData.data.user
                });
                console.warn("Login success but no refresh token received.");
            } else {
                const failureMessage = responseData?.message || "Login failed: Invalid server response or missing user data";
                console.warn("Login success but incomplete data. Message:", failureMessage);
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

export const useUpdateProfileSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSettingsPayload) => Auth.updateProfileSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            Toast.show({
                type: "success",
                text1: "Settings updated successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
    });
};

export const useChangePassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: ChangePasswordPayload) => Auth.changePassword(data),
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Password changed successfully",
                position: "top",
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
            router.back();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
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

export const useSendOtp = () => {
    return useMutation({
        mutationFn: (data: { email?: string, phone_number?: string }) => Auth.sendOtp({ ...data, is_home_owner: true }),
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
        mutationFn: (data: { email?: string, phone_number?: string, otp: string }) => {
            console.log("useVerifyOtp mutationFn called with payload:", data);
            return Auth.verifyOtp({ ...data, is_home_owner: true });
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

export const useVerifyQBox = () => {
    return useMutation({
        mutationFn: (data: VerifyQBoxPayload) => Auth.verifyQBox(data),
    });
};

export const useVerifyAddress = () => {
    return useMutation({
        mutationFn: (data: VerifyAddressPayload) => Auth.verifyAddress(data),
    });
};

export const useSendOtpForResetPassword = () => {
    return useMutation({
        mutationFn: (data: ResetInitiatePayload) => Auth.resetPasswordInitiate(data),
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
        mutationFn: (data: { email?: string, phone_number?: string, otp: string }) => {
            console.log("useVerifyOtpForResetPassword mutationFn called with payload:", data);
            return Auth.verifyOtp({ ...data, is_home_owner: true, is_forget_otp: true });
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
        mutationFn: (data: ResetConfirmPayload) => {
            console.log("this is the new password", data.new_password);
            return Auth.resetPasswordConfirm(data);
        },
        onSuccess: () => {
            console.log("Change password successfully");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Change password operation failed";
            console.log(error.response?.data?.message)
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
