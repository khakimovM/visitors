/**
 * =========================================================
 * 🔐 Auth Token Management (Cookie asosida)
 * =========================================================
 * Ushbu modul cookie orqali tokenni saqlash, olish va
 * tekshirish uchun xavfsiz yordamchi funksiyalarni taqdim etadi.
 */

 import Cookies from "js-cookie";

 // ---------------------------------------------------------
 // ⚙️ User interfeysi (type-safe)
 export interface User {
   id: string; // yoki number, sizning loyihaga qarab
   email: string;
   username: string;
 }
 
 // ---------------------------------------------------------
 // ⚙️ Cookie kalitlari
 // ---------------------------------------------------------
 export const AUTH_TOKEN_KEY = "token";
 export const USER_DATA_KEY = "user";
 
 // ---------------------------------------------------------
 // ⚙️ Cookie sozlamalari (xavfsizlik uchun)
 // ---------------------------------------------------------
 const cookieOptions: Cookies.CookieAttributes = {
   expires: 7, // Token 7 kun saqlanadi
   sameSite: "strict",
   secure: typeof window !== "undefined" && window.location.protocol === "https:", // faqat HTTPSda secure
   path: "/", // har bir sahifada mavjud bo‘lishi uchun
 };
 
 // ---------------------------------------------------------
 // ⚙️ Tokenni cookie'ga yozish funksiyasi
 // ---------------------------------------------------------
 export const setAuthToken = (token: string): void => {
   if (typeof window === "undefined" || !token) return;
   Cookies.set(AUTH_TOKEN_KEY, token, cookieOptions);
 };
 
 // ---------------------------------------------------------
 // ⚙️ Tokenni olish funksiyasi
 // ---------------------------------------------------------
 export const getAuthToken = (): string | undefined => {
   if (typeof window === "undefined") return undefined;
   return Cookies.get(AUTH_TOKEN_KEY);
 };
 
 // ---------------------------------------------------------
 // ⚙️ Cookie’dan tokenni tozalash funksiyasi
 // ---------------------------------------------------------
 export const clearAuth = (): void => {
   if (typeof window === "undefined") return;
   Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
   Cookies.remove(USER_DATA_KEY, { path: "/" });
 };
 
 // ---------------------------------------------------------
 // ⚙️ Foydalanuvchi login qilganligini tekshirish
 // ---------------------------------------------------------
 export const isAuthenticated = (): boolean => {
   const token = getAuthToken();
   return !!token && token.trim().length > 0;
 };
 
 // ---------------------------------------------------------
 // ⚙️ Tokenni dekodlash (JWT decode)
 // ---------------------------------------------------------
 export interface TokenPayload {
   exp?: number; // JWT expiration
   [key: string]: unknown; // boshqa JWT fieldlar
 }
 
 export const decodeToken = (): TokenPayload | null => {
   const token = getAuthToken();
   if (!token) return null;
 
   try {
     const [, payload] = token.split(".");
     const decoded = atob(payload);
     return JSON.parse(decoded) as TokenPayload;
   } catch (error) {
     console.error("❌ Token decode xatosi:", error);
     return null;
   }
 };
 
 // ---------------------------------------------------------
 // ⚙️ Token muddati tugaganini tekshirish
 // ---------------------------------------------------------
 export const isTokenExpired = (): boolean => {
   const payload = decodeToken();
   if (!payload?.exp) return false;
 
   const currentTime = Math.floor(Date.now() / 1000);
   return currentTime > payload.exp;
 };
 
 // ---------------------------------------------------------
 // ⚙️ Foydalanuvchi login holatini tekshirish
 // ---------------------------------------------------------
 export const isUserLoggedIn = (): boolean => {
   const token = getAuthToken();
   if (!token) return false;
 
   return !isTokenExpired();
 };
 
 // ---------------------------------------------------------
 // ⚙️ Foydalanuvchini cookie’da saqlash
 // ---------------------------------------------------------
 export const setUserData = (user: User): void => {
   if (typeof window === "undefined" || !user) return;
   Cookies.set(USER_DATA_KEY, JSON.stringify(user), cookieOptions);
 };
 
 // ---------------------------------------------------------
 // ⚙️ Foydalanuvchini cookie’dan olish
 // ---------------------------------------------------------
 export const getUserData = (): User | null => {
   if (typeof window === "undefined") return null;
   const data = Cookies.get(USER_DATA_KEY);
   if (!data) return null;
 
   try {
     return JSON.parse(data) as User;
   } catch (error) {
     console.error("❌ Cookie parse xatosi:", error);
     return null;
   }
 };
 