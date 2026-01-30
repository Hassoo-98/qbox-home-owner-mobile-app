// Auth Types
export interface AddressDetails {
    short_address: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
    building_number: string;
    secondary_number: string;
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
    phone: string;
    secondary_phone?: string;
    role?: string;
    qbox_id?: string;

    address_details: AddressDetails;

    installation: InstallationDetails;
}

export interface LoginPayload {
    email?: string;
    phone?: string;
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
    message: string;
    token: string;
    user: User;
}

export interface SendOtpPayload {
    contact: string;
}

export interface VerifyOtpPayload {
    contact: string;
    otp: string;
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
    contact: string;
    method: 'email' | 'phone';
}

export interface ResetVerifyPayload {
    otp: string;
}

export interface ResetConfirmPayload {
    uid: string;
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

export interface CreatePackageSendRequest {
    courier: string;
    locker_id: string;
}

// QR Types
import { QR_VALIDITY_DURATION_TYPE } from '@/constants/enums';

export interface GenerateQRPayload {
    user_id: string;
    locker_id: string;
    guest_name: string;
    valid_hours: number;
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
