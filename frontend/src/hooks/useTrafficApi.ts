import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { AUTH_ENDPOINTS } from '@/config/api';

export interface CreateDeviceRequest {
    userId: number;
    deviceId: number;
}

export interface CreateDeviceResponse {
    message: string;
}

export const useCreateDevice = () => {
    return useMutation<CreateDeviceResponse, AxiosError, CreateDeviceRequest>({
        mutationFn: async (data) => {
            const response = await axiosInstance.post<CreateDeviceResponse>(
                AUTH_ENDPOINTS.TRAFFIC.CREATE_DEVICE,
                data
            );
            return response.data;
        },
    });
};
