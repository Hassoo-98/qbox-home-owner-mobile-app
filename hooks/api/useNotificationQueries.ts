import * as Notification from '@/services/api/modules/notification';
import { AlertPayload } from '@/services/api/types';
import { useMutation } from '@tanstack/react-query';

export const useSendAlert = () => {
    return useMutation({
        mutationFn: (data: AlertPayload) => Notification.sendAlert(data),
    });
};
