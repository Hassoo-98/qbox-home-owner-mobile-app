// Auth Types
export interface RegisterPayload {
    full_name: string;
    email: string;
    password?: string; // Optional because API might not require it for social login, but usually required
    phone: string;
    role: string;
    // Add other fields as per your specific form
    secondaryPhone?: string;
    qBoxId?: string;
    shortId?: string;
    city?: string;
    district?: string;
    street?: string;
    postalCode?: string;
    buildingNumber?: string;
    secondaryNumber?: string;
    installationLocation?: string;
    accessInstruction?: string;
    qboxImage?: string;
}

export interface LoginPayload {
    email: string;
    password?: string;
    phone?: string; // Some apps allow phone login
}

export interface AuthResponse {
    token: string;
    user: any; // Define user type more specifically if possible
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
