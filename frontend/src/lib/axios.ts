import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosHeaders,
} from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";
import { clearAuth, getAuthToken } from "@/lib/auth";

interface AxiosErrorResponse {
    detail?: string;
    message?: string;
    [key: string]: unknown;
}


// =======================================================
// ⚙️ Axios instance
// =======================================================
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: new AxiosHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
    }),
});

// =======================================================
// 🚀 Request Interceptor — token qo‘shish
// =======================================================
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();

        if (token) {
            (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error("❌ Request Interceptor Error:", error);
        toast.error("So‘rov yuborishda xatolik yuz berdi.");
        return Promise.reject(error);
    }
);

// =======================================================
// 🧭 Response Interceptor — javobni boshqarish
// =======================================================
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const data = error.response?.data as AxiosErrorResponse | undefined;

        const message = data?.detail || data?.message;

        // 🔒 Token muddati tugagan yoki noto’g’ri
        if (status === 401) {
            toast.warning("Sessiya muddati tugagan. Iltimos, qayta tizimga kiring.");
            clearAuth();

            if (typeof window !== "undefined") {
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            }
        }

        // 🚫 Ruxsat yo‘q
        else if (status === 403) {
            toast.error("Ushbu amalni bajarish uchun sizda ruxsat yo‘q.");
        }

        // 🔍 Topilmadi
        else if (status === 404) {
            toast.error("So‘ralgan resurs topilmadi.");
        }

        // 💥 Server xatosi
        else if (status === 500) {
            toast.error("Serverda ichki xatolik yuz berdi. Keyinroq urinib ko‘ring.");
        }

        // 📩 Boshqa xatoliklar
        else if (message) {
            toast.error(message);
        } else {
            toast.error("Noma’lum xatolik yuz berdi.");
        }

        console.error("❌ Axios Response Error:", error);
        return Promise.reject(error);
    }
);

// =======================================================
// ✅ Export
// =======================================================
export default api;
