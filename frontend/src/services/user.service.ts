import axiosInstance from "@/lib/axios";
import { USER_ENDPOINTS } from "@/config/api";
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user";

export const userService = {
    async updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
        const res = await axiosInstance.put(USER_ENDPOINTS.UPDATE, data);
        return res.data;
    },
};
