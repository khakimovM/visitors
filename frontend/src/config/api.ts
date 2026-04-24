// src/lib/constants/endpoints.ts

// ✅ Asosiy API manzili .env fayldan olinadi
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// ✅ Auth endpointlari
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY_REGISTRATION: `${API_BASE_URL}/auth/verify-registration`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  UPDATE_USER: '/user/update',
  ANALYTICS: {
    VISITORS: '/analytics/visitors',
    TODAY_BRANCHES: '/analytics/today-branches',
    DAY_STATISTICS: '/analytics/day-statistics',
    BRANCHES: '/analytics/branches',
  },
  TRAFFIC: {
    CREATE_DEVICE: '/traffic/create-device',
  },
} as const;

// ✅ Foydalanuvchi endpointlari
export const USER_ENDPOINTS = {
  UPDATE: `${API_BASE_URL}/user/update`,
} as const;

// ✅ Analitika endpointlari
export const ANALYTICS_ENDPOINTS = {
  VISITORS: `${API_BASE_URL}/analytics/visitors`,
  TODAY_BRANCHES: `${API_BASE_URL}/analytics/today-branches`,
  DAY_STATISTICS: `${API_BASE_URL}/analytics/day-statistics`,
} as const;

// ✅ Trafik endpointlari
export const TRAFFIC_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/traffic`,
  CREATE_DEVICE: `${API_BASE_URL}/traffic/create-device`,
} as const;
