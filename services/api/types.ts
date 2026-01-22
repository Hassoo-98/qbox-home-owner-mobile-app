// Auth Types
export interface RegisterPayload {
    full_name: string;
    email: string;
    password?: string;
    phone: string;
    secondary_phone?: string;
    role?: string;
    qbox_id?: string;

    address_details: {
        short_address: string;
        city: string;
        district: string;
        street: string;
        postal_code: string;
        building_number: string;
        secondary_number: string;
    };

    installation: {
        location_preference: string;
        access_instruction: string;
        qbox_image_url: string;
    };
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
    address_details: {
        short_address: string;
        city: string;
        district: string;
        street: string;
        postal_code: string;
        building_number: string;
        secondary_number: string;
    };
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


// Forget Password
export interface SendOtpPayloadForResetPassword {
    contact: string,
    method: string
}

export interface VerifyOtpPayloadForResetPassword {
    otp: string
}

export interface ResetPassword {
    uid: string,
    new_password: string
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

// Profile Types
export interface UserProfile {
    avatar: string;
    email: string;
    full_name: string;
    phone: string;
    settings: {
        language: string;
        notifications: boolean;
    };
    stats: {
        active_lockers: number;
        total_deliveries: number;
    };
    uid: string;
}

export interface CheckUserPayload {
    email: string;
}

export interface CheckUserResponse {
    exists: boolean;
}
