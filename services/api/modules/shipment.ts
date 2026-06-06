import api from '../config';
import {
    CreateReportPayload,
    CreateReportResponse,
    CreateShipmentRequest,
    CreateShipmentResponse,
    GetPackageDetailsResponse,
    PackageListItem,
    PackageListResponse,
    PackageTimelineItem,
    ReturnPackageRequest,
    ReturnPackageResponse,
    ShipmentDetailResponse,
    ShipmentItem,
    ShipmentListResponse,
} from '../types';

const mapShipmentAttributes = (attributes: ShipmentItem['attributes']): PackageListItem['details'] => {
    if (!attributes) {
        return null;
    }

    return {
        id: 0,
        package_type: attributes.package_category || attributes.shipment_category || '',
        package_size: attributes.city || '',
        package_weight: attributes.package_weight || '',
        summary: attributes.description || '',
    };
};

export const mapShipmentToPackageListItem = (shipment: ShipmentItem, fallbackType: 'incoming' | 'outgoing'): PackageListItem => {
    const isOutgoing = fallbackType === 'outgoing';
    const qrCode = shipment.assigned_qr_code?.[0]?.qr_code_id || shipment.package_id || shipment.tracking_id;

    return {
        id: shipment.id,
        qbox: shipment.package_id,
        trackingId: shipment.tracking_id,
        tracking_id: shipment.tracking_id,
        merchant_name: shipment.service_provider_name || shipment.receiver_home_owner?.name || shipment.sender_home_owner?.name || '',
        service_provider: shipment.service_provider_name,
        service_provider_name: shipment.service_provider_name,
        driver_name: shipment.driver_details?.name || '',
        qr_code: qrCode,
        package_type: shipment.package_type,
        outgoing_status: isOutgoing ? shipment.outgoing_status : null,
        city: shipment.attributes?.city || '',
        sender_home_owner_city: shipment.sender_home_owner?.home_owner_city || '',
        sender_home_owner_name: shipment.sender_home_owner?.name || '',
        receiver_home_owner_name: shipment.receiver_home_owner?.name || '',
        shipment_status: shipment.shipment_status,
        last_update: shipment.last_update,
        created_at: shipment.created_at,
        details: mapShipmentAttributes(shipment.attributes),
    };
};

export const mapShipmentToPackageDetails = (shipment: ShipmentItem) => ({
    ...shipment,
    trackingId: shipment.tracking_id,
    tracking_id: shipment.tracking_id,
    courierName: shipment.service_provider_name || shipment.service_provider,
    lastUpdate: shipment.last_update,
    createdAt: shipment.created_at,
    type: shipment.package_type || shipment.shipment_type,
    status: shipment.shipment_status,
    qrCode: shipment.assigned_qr_code?.[0]?.qr_code_id || shipment.package_id || shipment.tracking_id,
    senderName: shipment.sender_home_owner?.name || '',
    attributes: shipment.attributes
        ? [
              { type: 'Package ID', value: shipment.attributes.package_id },
              { type: 'Package Weight', value: shipment.attributes.package_weight },
              { type: 'Package Category', value: shipment.attributes.package_category },
              { type: 'Shipment Category', value: shipment.attributes.shipment_category },
              { type: 'Item Value', value: `${shipment.attributes.item_value}` },
              { type: 'City', value: shipment.attributes.city || '' },
              { type: 'Description', value: shipment.attributes.description || shipment.description },
          ]
        : [],
    imageUrl: shipment.package_image,
});

export const getHomeOwnerReceivedShipments = async (homeOwnerId: string): Promise<ShipmentListResponse> => {
    const response = await api.get<ShipmentListResponse>(`/home_owner/${homeOwnerId}/received-shipments`);
    return response.data;
};

export const getHomeOwnerShipments = async (homeOwnerId: string): Promise<ShipmentListResponse> => {
    const response = await api.get<ShipmentListResponse>(`/home_owner/${homeOwnerId}/shipments`);
    return response.data;
};

export const getShipmentDetails = async (shipmentId: string): Promise<ShipmentDetailResponse> => {
    const response = await api.get<ShipmentDetailResponse>(`/shipments/${shipmentId}/`);
    return response.data;
};

export const getIncomingPackages = async (homeOwnerId: string): Promise<PackageListResponse> => {
    const response = await getHomeOwnerReceivedShipments(homeOwnerId);
    return {
        ...response,
        data: {
            ...response.data,
            items: response.data.items.map((shipment) => mapShipmentToPackageListItem(shipment, 'incoming')),
        },
    };
};

export const getIncomingPackagesDetails = async (homeOwnerId: string, id: string | number): Promise<ShipmentItem | null> => {
    const response = await getHomeOwnerReceivedShipments(homeOwnerId);
    return response.data.items.find((item) => item.id === String(id)) || null;
};

export const getOutgoingPackages = async (homeOwnerId: string): Promise<PackageListResponse> => {
    const response = await getHomeOwnerShipments(homeOwnerId);
    return {
        ...response,
        data: {
            ...response.data,
            items: response.data.items.map((shipment) => mapShipmentToPackageListItem(shipment, 'outgoing')),
        },
    };
};

export const getOutgoingPackagesDetails = async (homeOwnerId: string, id: string | number): Promise<ShipmentItem | null> => {
    const response = await getHomeOwnerShipments(homeOwnerId);
    return response.data.items.find((item) => item.id === String(id)) || null;
};

export const getDeliveredPackages = async (): Promise<PackageListResponse> => {
    const response = await api.get('/packages/delivered/');
    return response.data;
};

export const getDeliveredPackagesDetails = async (id: string | number): Promise<any> => {
    const response = await api.get(`/packages/delivered/${id}/`);
    return response.data;
};

export const createShipment = async (data: CreateShipmentRequest): Promise<CreateShipmentResponse> => {
    const response = await api.post('/shipments/create/', data);
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
