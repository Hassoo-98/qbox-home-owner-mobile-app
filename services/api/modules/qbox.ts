import api from '../config';
import {
    DeviceStatusResponse,
    DeviceTelemetryResponse,
    MqttReconnectResponseData,
    QBoxActionResponse,
    QBoxStreamsResponse,
    ServiceRestartResponseData,
    VerifyQBoxPayload,
} from '../types';

export type AlarmControlAction = 'start' | 'stop';

export const verifyQBoxId = async (data: VerifyQBoxPayload) => {
    const response = await api.post('/qbox/verify-id', data);
    return response.data;
};

export const getQBoxStreams = async (qbox_id: string): Promise<QBoxStreamsResponse> => {
    const response = await api.get<QBoxStreamsResponse>(`/devices/${qbox_id}/streams/`);
    return response.data;
};

export const getDeviceTelemetry = async (deviceId: string): Promise<DeviceTelemetryResponse> => {
    const response = await api.get<DeviceTelemetryResponse>(`/devices/${deviceId}/telemetry/`);
    return response.data;
};

export const getDeviceStatus = async (deviceId: string): Promise<DeviceStatusResponse> => {
    const response = await api.get<DeviceStatusResponse>(`/devices/${deviceId}/status/`);
    return response.data;
};

export const rebootDevice = async (deviceId: string) => {
    const response = await api.post(`/devices/${deviceId}/actions/reboot/`);
    return response.data;
};

export const factoryResetDevice = async (deviceId: string) => {
    const response = await api.post(`/devices/${deviceId}/actions/factory_reset/`);
    return response.data;
};

export const controlDeviceAlarm = async (deviceId: string, action: AlarmControlAction) => {
    const response = await api.post(`/devices/${deviceId}/alarm/control/`, {
        action,
    });
    return response.data;
};

export const reconnectDeviceMqtt = async (deviceId: string): Promise<QBoxActionResponse<MqttReconnectResponseData>> => {
    const response = await api.post<QBoxActionResponse<MqttReconnectResponseData>>(`/devices/${deviceId}/mqtt/reconnect/`);
    return response.data;
};

export const restartQBoxService = async (deviceId: string): Promise<QBoxActionResponse<ServiceRestartResponseData>> => {
    const response = await api.post<QBoxActionResponse<ServiceRestartResponseData>>(
        `/devices/${deviceId}/service/restart/`,
        {
            service: 'qbox-device.service',
        }
    );
    return response.data;
};
