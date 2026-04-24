// src/services/analytics.service.ts
import axiosInstance from "@/lib/axios";
import { ANALYTICS_ENDPOINTS } from "@/config/api";
import {
    VisitorsParams,
    VisitorsResponse,
    TodayBranchesResponse,
    DayStatisticsParams,
    DayStatisticsResponse,
} from "@/types/analytics";

export const analyticsService = {
    getVisitors(params: VisitorsParams): Promise<VisitorsResponse> {
        return axiosInstance
            .get(ANALYTICS_ENDPOINTS.VISITORS, { params })
            .then(res => res.data);
    },

    getTodayBranches(): Promise<TodayBranchesResponse> {
        return axiosInstance
            .get(ANALYTICS_ENDPOINTS.TODAY_BRANCHES)
            .then(res => res.data);
    },

    getDayStatistics(params: DayStatisticsParams): Promise<DayStatisticsResponse> {
        return axiosInstance
            .get(ANALYTICS_ENDPOINTS.DAY_STATISTICS, { params })
            .then(res => res.data);
    },
};
