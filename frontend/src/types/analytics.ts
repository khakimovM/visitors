export interface VisitorsParams {
    from: string;
    to: string;
}

export interface VisitorsResponse {
    totalVisitors: number;
    data: { date: string; visitors: number }[];
}

export interface TodayBranchesResponse {
    totalBranches: number;
    branches: { id: number; name: string; visitors: number }[];
}

export interface DayStatisticsParams {
    day: string;
}

export interface DayStatisticsResponse {
    day: string;
    totalVisitors: number;
    totalExits: number;
}

///////***** */
export interface VisitorDataPoint {
    date: string;
    inCount: number;
    outCount: number;
}

export interface TodayBranchStats {
    userId: number;
    username: string;
    inCount: number;
    outCount: number;
}

export interface HourlyStats {
    hour: number;
    inCount: number;
    outCount: number;
}

export interface BranchInfo {
    id: number;
    name: string;
    email: string;
    lastActivity: string | null;
    inCount: number;
    outCount: number;
}

export interface VisitorsQueryParams {
    from: string;
    to: string;
    branchId?: number;
}

export interface DayStatisticsQueryParams {
    day: string;
}
