import api from '../config';
import { CameraActionPayload } from '../types';

export const startRecording = async (data: CameraActionPayload) => {
    const response = await api.post('/api/camera/start', data);
    return response.data;
};

export const stopRecording = async (data: CameraActionPayload) => {
    const response = await api.post('/api/camera/stop', data);
    return response.data;
};

export const listVideos = async (lockerId?: string) => {
    const url = lockerId ? `/api/camera/videos/${lockerId}` : '/api/camera/videos';
    const response = await api.get(url);
    return response.data;
};

export const uploadVideo = async (fileUri: string, fileName: string = 'video.mp4', fileType: string = 'video/mp4') => {
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
    } as any);

    const response = await api.post('/api/camera/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
