// Auth Types
export interface RegisterPayload {
    full_name: string;
    email: string;
    password?: string;
    phone: string;
    secondary_phone?: string;
    role?: string;
    qbox_id?: string;
    short_id?: string;
    city?: string;
    district?: string;
    street?: string;
    postal_code?: string;
    building_number?: string;
    secondary_number?: string;
    installation_location?: string;
    access_instruction?: string;
    qbox_image?: string;
}

export interface LoginPayload {
    email?: string;
    password: string;
    phone?: string; // Some apps allow phone login
}

export interface AuthResponse {
    token: string;
    user: any; // Define user type more specifically if possible
}

export interface SendOtpPayload {
    contact: string;
}

export interface VerifyOtpPayload {
    contact: string;
    otp: string;
}

// Locker Types
export interface CreateLockerPayload {
    locker_number: string;
    location: string;
}

export interface Locker {
    locker_id: string; // or _id depending on DB
    locker_number: string;
    location: string;
    status: 'available' | 'occupied' | 'open' | 'closed'; // Example statuses
}

export interface UpdateLockerStatusPayload {
    locker_id: string;
    status: string;
}

export interface VerifyQrPayload {
    qr_data: string;
}

// Camera Types
export interface CameraActionPayload {
    locker_id: string;
}

export interface VideoRecord {
    id: string;
    url: string;
    timestamp: string;
    locker_id: string;
}

// Notification Types
export interface AlertPayload {
    user_id: string;
    title: string;
    body: string;
}

// Shipment Types
export interface CreateOrderPayload {
    locker_id: string;
    receiver_phone: string;
}

export interface Order {
    id: string;
    tracking_number: string;
    status: string;
    locker_id: string;
}

export interface UpdateOrderStatusPayload {
    status: string;
}

// Admin Types
export interface AdminStats {
    totalUsers: number;
    activeLockers: number;
    // ...
}
