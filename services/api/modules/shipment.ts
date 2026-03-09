import api from '../config';
import {
    CreateReportPayload,
    CreateReportResponse,
    GetPackageDetailsResponse,
    PackageListResponse,
    PackageTimelineItem,
    ReturnPackageRequest,
    ReturnPackageResponse,
    SendPackageRequest,
    SendPackageResponse
} from '../types';


export const getIncomingPackages = async (): Promise<PackageListResponse> => {
    const response = await api.get('/packages/incoming/');
    return response.data;
};

export const getIncomingPackagesDetails = async (id: string | number): Promise<any> => {
    const response = await api.get(`/packages/incoming/${id}/`);
    return response.data;
};

export const getOutgoingPackages = async (): Promise<PackageListResponse> => {
    const response = await api.get('/packages/outgoing/');
    return response.data;
};
export const getOutgoingPackagesDetails = async (id: string | number): Promise<any> => {
    const response = await api.get(`/packages/outgoing/${id}/`);
    return response.data;
};

export const getDeliveredPackages = async (): Promise<PackageListResponse> => {
    const response = await api.get('/packages/delivered/');
    return response.data;
};

export const getDeliveredPackagesDetails = async (id: string | number): Promise<any> => {
    const response = await api.get(`/packages/delivered/${id}/`);
    return response.data;
};

export const sendPackage = async (data: SendPackageRequest): Promise<SendPackageResponse> => {
    const response = await api.post('/packages/send/', data);
    return response.data;
};

export const returnPackage = async (data: ReturnPackageRequest): Promise<ReturnPackageResponse> => {
    const response = await api.post('/packages/return/', data);
    return response.data;
};

export const getPackageDetails = async (id: string | number): Promise<GetPackageDetailsResponse> => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
};

export const getPackageTimeline = async (id: string | number): Promise<PackageTimelineItem[]> => {
    const response = await api.get(`/timelines/tracking/${id}/`);
    return response.data.data;
};

export const reportIssue = async (data: CreateReportPayload): Promise<CreateReportResponse> => {
    const response = await api.post('/timelines/', data);
    return response.data;
};
