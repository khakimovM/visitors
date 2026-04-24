"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// --- Foydalanuvchi ma'lumotlari interfeysi ---
interface User {
  id: string;
  email: string;
  username: string;
  role: string
}

// --- Auth Context interfeysi ---
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

// --- Context yaratish ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- Provider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Foydalanuvchini localStorage'dan yuklash
  useEffect(() => {
    try {
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser) as User;
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error("❌ Foydalanuvchini yuklashda xatolik:", error);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ setUser — foydalanuvchini saqlash (faqat localStorage)
  const handleSetUser = (newUser: User | null) => {
    if (newUser) {
      setUserState(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      setUserState(null);
      localStorage.removeItem("user");
    }
  };

  // ✅ logout — tizimdan chiqish
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");

    toast.success("Chiqish", {
      description: "Tizimdan muvaffaqiyatli chiqdingiz!",
    });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
