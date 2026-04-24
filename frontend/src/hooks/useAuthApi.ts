import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  RegisterRequest,
  RegisterResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth';
import { AUTH_ENDPOINTS } from '@/config/api';
import api from '@/lib/axios';

export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError, RegisterRequest>({
    mutationFn: async (data) => {
      const response = await api.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        data
      );
      return response.data;
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation<VerifyOTPResponse, AxiosError, VerifyOTPRequest>({
    mutationFn: async (data) => {
      const response = await api.post<VerifyOTPResponse>(
        AUTH_ENDPOINTS.VERIFY_REGISTRATION,
        data
      );
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: async (data) => {
      const response = await api.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        data
      );
      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, AxiosError, ForgotPasswordRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ForgotPasswordResponse>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        data
      );
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, AxiosError, ResetPasswordRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ResetPasswordResponse>(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        data
      );
      return response.data;
    },
  });
};

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface UpdateUserResponse {
  message: string;
}

export const useUpdateUser = () => {
  return useMutation<UpdateUserResponse, AxiosError, UpdateUserRequest>({
    mutationFn: async (data) => {
      const response = await api.put<UpdateUserResponse>(
        AUTH_ENDPOINTS.UPDATE_USER,
        data
      );
      return response.data;
    },
  });
};