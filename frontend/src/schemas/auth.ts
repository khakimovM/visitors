import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('auth.validation.invalidEmail'),
    username: z.string().min(3, 'auth.validation.usernameMin').max(50, 'auth.validation.usernameMax'),
    password: z.string().min(6, 'auth.validation.passwordMin'),
});

export const verifyOTPSchema = z.object({
    email: z.string().email('auth.validation.invalidEmail'),
    otp: z.string().length(6, 'auth.validation.otpLength'),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'auth.validation.usernameRequired'),
    password: z.string().min(1, 'auth.validation.passwordRequired'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('auth.validation.invalidEmail'),
});

export const resetPasswordSchema = z.object({
    email: z.string().email('auth.validation.invalidEmail'),
    otp: z.string().length(6, 'auth.validation.otpLength'),
    newPassword: z.string().min(6, 'auth.validation.passwordMin'),
    confirmPassword: z.string().min(6, 'auth.validation.passwordMin'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth.validation.passwordMatch',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;