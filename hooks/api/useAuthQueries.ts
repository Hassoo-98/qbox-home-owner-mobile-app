import * as Auth from '@/services/api/modules/auth';
import { LoginPayload, RegisterPayload } from '@/services/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) => Auth.registerUser(data),
        onSuccess: (data) => {
            // Handle success (e.g., navigate to login or auto-login)
            // You might want to save token here if the register endpoint returns one
            Alert.alert('Success', 'Registration successful');
            router.navigate('/(auth)');
        },
        onError: (error: any) => {
            Alert.alert('Registration Error', error.response?.data?.message || 'Something went wrong');
        }
    });
};

export const useLogin = () => {
    // Note: You might need to access your AuthContext here to set the user/token
    // context.login(data.token)
    return useMutation({
        mutationFn: (data: LoginPayload) => Auth.loginUser(data),
        onSuccess: (data) => {
            // Let the caller handle the context update, or do it here if possible
        },
        onError: (error: any) => {
            Alert.alert('Login Error', error.response?.data?.message || 'Invalid credentials');
        }
    });
};

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: Auth.getUserProfile,
    });
};
