// src/routes.tsx
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// ✅ Lazy-loaded pages (optimize bundle size)
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const VerifyOTP = lazy(() => import("@/pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Devices = lazy(() => import("@/pages/Devices"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const appRoutes = [
    // ✅ Auth routes
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify-otp", element: <VerifyOTP /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },

    // ✅ Protected routes
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Layout>
                    <Dashboard />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/devices",
        element: (
            <ProtectedRoute>
                <Layout>
                    <Devices />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Layout>
                    <Profile />
                </Layout>
            </ProtectedRoute>
        ),
    },

    // ✅ Not Found route
    { path: "*", element: <NotFound /> },
];
