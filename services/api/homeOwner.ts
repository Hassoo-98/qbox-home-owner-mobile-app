import api from './config';

export interface Address {
    short_address: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
    building_number: string;
    secondary_building_number: string;
}

export interface HomeOwner {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    secondary_phone_number: string | null;
    is_verified: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    address: Address;
    installation_location_preference: string;
    installation_access_instruction: string;
    installation_qbox_image_url: string;
    is_active: boolean;
    date_joined: string;
    qboxes: any[]; // Define specific QBox type if available, otherwise any[] for now
}

export interface HomeOwnerResponse {
    success: boolean;
    statusCode: number;
    data: HomeOwner;
    message: string;
}

export const getHomeOwner = async (id: string): Promise<HomeOwnerResponse> => {
    try {
        const response = await api.get<HomeOwnerResponse>(`/home_owner/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
