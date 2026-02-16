// Auth Types
export interface AddressDetails {
    short_address: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
    building_number: string;
    secondary_building_number: string;
}

export interface InstallationDetails {
    location_preference: string;
    access_instruction: string;
    qbox_image_url: string;
}

export interface RegisterPayload {
    full_name: string;
    email: string;
    password?: string;
    phone_number: string;
    secondary_phone_number?: string;
    role?: string;
    qbox_id?: string;

    address: AddressDetails;

    installation: InstallationDetails;
}

export interface LoginPayload {
    email?: string;
    phone_number?: string;
    password: string;
}

export interface User {
    uid: string;
    full_name: string;
    email: string;
    phone: string;
    secondary_phone: string;
    role: string;
    status: string;
    language: string;
    notifications_enabled: boolean;
    created_at: string;
    avatar?: string;
    address_details: AddressDetails;
}

export interface AuthResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        access: string;
        user: User;
    };
    token?: string;
}

export interface SendOtpPayload {
    email?: string;
    phone_number?: string;
    is_home_owner: boolean;
}

export interface VerifyOtpPayload {
    email?: string;
    phone_number?: string;
    otp: string;
    is_home_owner: boolean;
    is_forget_otp?: boolean;
}

export interface CheckUserPayload {
    email: string;
}

export interface CheckUserResponse {
    exists: boolean;
}

export interface VerifyQBoxPayload {
    qbox_id: string;
}

export interface VerifyAddressPayload {
    short_address: string;
}

// Forget Password
export interface ResetInitiatePayload {
    email?: string;
    phone_number?: string;
    is_forget_otp: boolean;
    is_home_owner: boolean;
}

export interface ResetVerifyPayload {
    otp: string;
}

export interface ResetConfirmPayload {
    email?: string;
    phone_number?: string;
    new_password: string;
}

// Locker Types
export interface Locker {
    id: string;
    locker_id: string;
    locker_number: string;
    location: string;
    status: string;
    last_activity?: string;
}

export interface LinkLockerPayload {
    locker_id: string;
}

export interface LockerStatusResponse {
    id: string;
    status: string;
    camera_status?: string;
    led_status?: string;
    power_status?: string;
}

// Package / Shipment Types
export interface Package {
    id: number;
    title: string;
    Subtitle: string;
    trackingId: string;
    createdAt: string;
    city?: string | null;
    status: string | null;
    type: 'incoming' | 'outgoing' | 'delivered';
}

export interface PackageListItemDetails {
    id: number;
    package_type: string;
    package_size: string;
    package_weight: string;
    summary: string;
}

export interface PackageListItem {
    id: string;
    qbox: string | null;
    tracking_id: string;
    merchant_name: string;
    service_provider: string;
    driver_name: string;
    qr_code: string;
    package_type: string;
    outgoing_status: string | null;
    city: string;
    shipment_status: string;
    last_update: string;
    created_at: string;
    details: PackageListItemDetails | null;
}

export interface PackageListResponse {
    success: boolean;
    statusCode: number;
    data: {
        items: PackageListItem[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
    message: string;
}

export interface GetPackageDetailsResponse {
    success: boolean;
    statusCode: number;
    data: PackageListItem;
    message: string;
}

export interface PackageDetailAttribute {
    type: string;
    value: string;
}

export interface PackageDetails {
    id: number;
    type: 'incoming' | 'outgoing' | 'delivered';
    trackingId: string;
    courierName: string;
    lastUpdate: string;
    qrCode: string;
    description: string;
    imageUrl: string | number; // Changed from any to string (URL) or number (require result)
    attributes: PackageDetailAttribute[];
    status?: string;
    phoneNumber?: string;
    email?: string;
    recepientName?: string;
    paymentSummary?: {
        paymentMethod: string;
        charges: { key: string; value: number }[];
        currency: string;
    };
}

export interface PackageTimelineItem {
    id: number;
    packageId: number;
    timestamp: string;
    status: string;
    location: string;
}

export interface SendPackageRequest {
    shippingCompany: string;
    qboxImage: string;
    packageDescription: string;
    packageItemValue: number;
    currency: string;
    packageWeight: number;
    packageType: string;
    qBoxId: string;
    phone: string;
    email: string;
    fullName: string;
}

export interface SendPackageResponse {
    success: boolean;
    statusCode: number;
    data: any;
    message: string;
}

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
    qboxes: any[];
}

export interface HomeOwnerResponse {
    success: boolean;
    statusCode: number;
    data: HomeOwner;
    message: string;
}

export interface UpdateHomeOwnerRequest {
    full_name: string;
    email: string;
    phone_number?: string;
    secondary_phone_number?: string;
    address?: {
        short_address?: string;
        city?: string;
        district?: string;
        street?: string;
        postal_code?: string;
        building_number?: string;
        secondary_building_number?: string;
    };
    installation_location_preference?: string;
    installation_access_instruction?: string;
    is_active?: boolean;
}

export interface UpdateHomeOwnerResponse {
    success: boolean;
    statusCode: number;
    data: HomeOwner;
    message: string;
}

// QR Types
import { QR_VALIDITY_DURATION_TYPE } from '@/constants/enums';

export interface GenerateQRPayload {
    user_id: string;
    locker_id: string;
    guest_name: string;
    valid_hours: number;
}

export interface CreateQRCodePayload {
    qbox_id: string;
    max_users: number;
    duration_type: string;
    valid_duration: number;
    name: string;
}

export interface QRCodeData {
    id: string;
    qbox: string;
    qbox_id: string;
    homeowner: string | null;
    name: string;
    location: string;
    address: string;
    max_users: number;
    current_users: number;
    remaining_users: number;
    duration_type: string;
    valid_duration: number;
    expires_at: string;
    access_token: string;
    qr_code_image: string;
    is_active: boolean;
    status: string;
    expiresIn: string;
    created_at: string;
    updated_at: string;
}

export interface CreateQRCodeResponse {
    success: boolean;
    statusCode: number;
    data: QRCodeData;
    message: string;
}

export interface GetQRCodeDetailsResponse {
    success: boolean;
    statusCode: number;
    data: QRCodeData;
    message: string;
}

export interface QRHistoryResult {
    id: string;
    qbox_id: string;
    name: string;
    status: string;
    validforUsers: number;
    expiresIn: string;
    created_at: string;
}

export interface QRHistoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: QRHistoryResult[];
}

export interface QRHistoryItem {
    id: number;
    title: string;
    isActive: boolean;
    createdAt: string;
    validityDuration: number;
    validityDurationType: QR_VALIDITY_DURATION_TYPE;
    maxUsers: number;
    usersLeft: number;
}

export interface QRScanItem {
    id: number;
    qrCodeId: number;
    qrCodeScanTime: string;
    qrCodeScanLocation: string;
    qrCodeScanUser: string;
    openedAt: string;
    closedAt: string;
    status: string;
    videoUrl: string;
}

// Home / Dashboard Types
export interface Offer {
    id: number;
    title: string;
    description: string;
    image_url: string | number;
    button_text: string;
    button_color: string;
}

export interface Subscription {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    transactionId: string;
    paymentMethod: string;
    amount: string;
    currency: string;
}

// Profile & Settings
export interface UserProfile {
    uid: string;
    full_name: string;
    email: string;
    phone: string;
    secondary_phone?: string;
    address_details?: AddressDetails;
    installation?: InstallationDetails;
    language: string;
    notifications_enabled: boolean;
    avatar?: string;
}

export interface UpdateSettingsPayload {
    language: string;
    notifications_enabled: boolean;
}

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

// Notifications
export interface Notification {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
}

export interface AlertPayload {
    title: string;
    body: string;
    user_id: string;
}
