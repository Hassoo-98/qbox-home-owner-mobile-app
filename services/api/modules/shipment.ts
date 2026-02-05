import api from '../config';
import {
    CreatePackageSendRequest,
    Package,
    PackageDetails,
    PackageTimelineItem
} from '../types';

export const listPackages = async (): Promise<Package[]> => {
    const response = await api.get('/home_owner/packages');
    return response.data;
};

export const getPackageDetails = async (id: string | number): Promise<PackageDetails> => {
    const response = await api.get(`/home_owner/packages/${id}/details`);
    return response.data;
};

export const getPackageTimeline = async (id: string | number): Promise<PackageTimelineItem[]> => {
    const response = await api.get(`/home_owner/packages/${id}/timeline`);
    return response.data;
};

export const createSendRequest = async (data: CreatePackageSendRequest) => {
    const response = await api.post('/home_owner/packages/send', data);
    return response.data;
};

// Maintaining backward compatibility if needed, but the API seems to have changed
export const createOrder = createSendRequest;
