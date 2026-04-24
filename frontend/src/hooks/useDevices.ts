"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

export interface UserShort {
    id: number;
    username: string;
    email: string;
}

export interface Device {
    id: number;
    userId: number;
    deviceId: number;
    status?: "online" | "offline";
    createdAt?: string;
    updatedAt?: string;
    user?: UserShort;
}

interface DevicesResponse {
    devices: Device[];
}

interface CreateDeviceDto {
    userId: number;
    deviceId: number;
}

interface UpdateDeviceDto {
    oldUserId: number;
    newUserId: number;
    deviceId: number;
}

interface DeleteDeviceDto {
    userId: number;
    deviceId: number;
}

const ENDPOINTS = {
    GET_ALL: "/traffic/my-all-devices",
    CREATE: "/traffic/create-device",
    UPDATE: "/traffic/update-device",
    DELETE: "/traffic/delete-device",
};

// ✅ GET — barcha qurilmalarni olish
export const useDevices = () => {
    return useQuery<DevicesResponse, AxiosError>({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await api.get<DevicesResponse>(ENDPOINTS.GET_ALL);
            return res.data;
        },
    });
};

// ✅ POST — yangi qurilma yaratish
export const useCreateDevice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateDeviceDto) => {
            const res = await api.post(ENDPOINTS.CREATE, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
    });
};

// ✅ PUT — mavjud qurilmani yangilash
export const useUpdateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateDeviceDto) => {
            const res = await api.put(ENDPOINTS.UPDATE, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
    });
};

// ✅ DELETE — qurilmani o‘chirish
export const useDeleteDevice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: DeleteDeviceDto) => {
            const res = await api.delete(ENDPOINTS.DELETE, { data });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
    });
};
