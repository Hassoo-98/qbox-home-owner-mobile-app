import api from './config';
import { HomeOwnerResponse, UpdateHomeOwnerRequest, UpdateHomeOwnerResponse } from './types';

export const getHomeOwner = async (id: string): Promise<HomeOwnerResponse> => {
    try {
        const response = await api.get<HomeOwnerResponse>(`/home_owner/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateHomeOwner = async (id: string, data: UpdateHomeOwnerRequest): Promise<UpdateHomeOwnerResponse> => {
    try {
        const response = await api.put<UpdateHomeOwnerResponse>(`/home_owner/${id}/update`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
