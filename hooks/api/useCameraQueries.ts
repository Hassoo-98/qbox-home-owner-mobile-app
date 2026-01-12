import * as Camera from '@/services/api/modules/camera';
import { CameraActionPayload } from '@/services/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useStartRecording = () => {
    return useMutation({
        mutationFn: (data: CameraActionPayload) => Camera.startRecording(data),
    });
};

export const useStopRecording = () => {
    return useMutation({
        mutationFn: (data: CameraActionPayload) => Camera.stopRecording(data),
    });
};

export const useVideos = (lockerId?: string) => {
    return useQuery({
        queryKey: ['videos', lockerId],
        queryFn: () => Camera.listVideos(lockerId),
        enabled: !!lockerId, // Only fetch if lockerId is provided, or remove strict check if you want all
    });
};

export const useUploadVideo = () => {
    return useMutation({
        mutationFn: ({ uri, name, type }: { uri: string; name?: string; type?: string }) =>
            Camera.uploadVideo(uri, name, type),
    });
};
