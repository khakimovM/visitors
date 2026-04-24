import axiosInstance from "@/lib/axios";
import { TRAFFIC_ENDPOINTS } from "@/config/api";
import {
    CreateTrafficRequest,
    CreateTrafficResponse,
    CreateDeviceRequest,
    CreateDeviceResponse,
} from "@/types/traffic";

export const trafficService = {
    async createTraffic(data: CreateTrafficRequest): Promise<CreateTrafficResponse> {
        const res = await axiosInstance.post(TRAFFIC_ENDPOINTS.CREATE, data);
        return res.data;
    },

    async createDevice(data: CreateDeviceRequest): Promise<CreateDeviceResponse> {
        const res = await axiosInstance.post(TRAFFIC_ENDPOINTS.CREATE_DEVICE, data);
        return res.data;
    },
};
