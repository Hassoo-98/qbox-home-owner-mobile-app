import { Colors } from '@/constants';
import * as QBox from '@/services/api/modules/qbox';
import { VerifyQBoxPayload } from '@/services/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';
export { useDeviceStatusSocket, useDeviceTelemetrySocket } from './useQBoxLiveSockets';

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

export const useDeviceTelemetry = (deviceId: string) => {
    return useQuery({
        queryKey: ['device-telemetry', deviceId],
        queryFn: () => QBox.getDeviceTelemetry(deviceId),
        enabled: !!deviceId,
        staleTime: 30 * 1000,
    });
};

export const useDeviceStatus = (deviceId: string) => {
    return useQuery({
        queryKey: ['device-status', deviceId],
        queryFn: () => QBox.getDeviceStatus(deviceId),
        enabled: !!deviceId,
        staleTime: 30 * 1000,
    });
};

export const useRebootDevice = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => QBox.rebootDevice(deviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device-status', deviceId] });
            queryClient.invalidateQueries({ queryKey: ['device-telemetry', deviceId] });
            Toast.show({
                type: 'success',
                text1: 'Reboot command sent successfully',
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to send reboot command';
            Toast.show({
                type: 'error',
                text1: errorMessage,
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        },
    });
};

export const useFactoryResetDevice = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => QBox.factoryResetDevice(deviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device-status', deviceId] });
            queryClient.invalidateQueries({ queryKey: ['device-telemetry', deviceId] });
            Toast.show({
                type: 'success',
                text1: 'Factory reset command sent successfully',
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to send factory reset command';
            Toast.show({
                type: 'error',
                text1: errorMessage,
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        },
    });
};

export const useControlDeviceAlarm = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (action: 'start' | 'stop') => QBox.controlDeviceAlarm(deviceId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device-status', deviceId] });
        },
    });
};

export const useReconnectDeviceMqtt = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => QBox.reconnectDeviceMqtt(deviceId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['device-status', deviceId] });
            Toast.show({
                type: 'success',
                text1: data.message || 'MQTT reconnect request sent',
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to reconnect MQTT';
            Toast.show({
                type: 'error',
                text1: errorMessage,
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        },
    });
};

export const useRestartQBoxService = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => QBox.restartQBoxService(deviceId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['homeOwner'] });
            queryClient.invalidateQueries({ queryKey: ['qboxStreams'] });
            queryClient.invalidateQueries({ queryKey: ['device-status', deviceId] });
            queryClient.invalidateQueries({ queryKey: ['device-telemetry', deviceId] });
            Toast.show({
                type: 'success',
                text1: data.message || 'Service restart request sent',
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.success,
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to restart service';
            Toast.show({
                type: 'error',
                text1: errorMessage,
                position: 'top',
                backgroundColor: Colors.white,
                textColor: Colors.text,
                progressBarColor: Colors.danger,
                visibilityTime: 3000,
            });
        },
    });
};
