export interface CreateTrafficRequest {
    device_id: number;
    in_count: number;
    out_count: number;
}

export interface CreateTrafficResponse {
    success: boolean;
    message: string;
}

export interface CreateDeviceRequest {
    userId: number;
    deviceId: number;
}

export interface CreateDeviceResponse {
    success: boolean;
    message: string;
}
