import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AUTH_ENDPOINTS } from '@/config/api';
import {
    VisitorDataPoint,
    TodayBranchStats,
    HourlyStats,
    BranchInfo,
    VisitorsQueryParams,
    DayStatisticsQueryParams,
} from '@/types/analytics';
import api from '@/lib/axios';

export const useVisitorsData = (params: VisitorsQueryParams) => {
    return useQuery<VisitorDataPoint[], AxiosError>({
        queryKey: ['visitors', params],
        queryFn: async () => {
            const response = await api.get<VisitorDataPoint[]>(
                AUTH_ENDPOINTS.ANALYTICS.VISITORS,
                { params }
            );
            return response.data;
        },
        enabled: !!params.from && !!params.to,
    });
};

export const useTodayBranches = () => {
    return useQuery<TodayBranchStats[], AxiosError>({
        queryKey: ['today-branches'],
        queryFn: async () => {
            const response = await api.get<TodayBranchStats[]>(
                AUTH_ENDPOINTS.ANALYTICS.TODAY_BRANCHES
            );
            return response.data;
        },
    });
};

export const useDayStatistics = (params: DayStatisticsQueryParams) => {
    return useQuery<HourlyStats[], AxiosError>({
        queryKey: ['day-statistics', params],
        queryFn: async () => {
            const response = await api.get<HourlyStats[]>(
                AUTH_ENDPOINTS.ANALYTICS.DAY_STATISTICS,
                { params }
            );
            return response.data;
        },
        enabled: !!params.day,
    });
};

export const useBranches = () => {
    return useQuery<BranchInfo[], AxiosError>({
        queryKey: ['branches'],
        queryFn: async () => {
            const response = await api.get<BranchInfo[]>(
                AUTH_ENDPOINTS.ANALYTICS.BRANCHES
            );
            return response.data;
        },
    });
};
