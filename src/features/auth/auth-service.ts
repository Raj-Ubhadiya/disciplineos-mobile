import type {
  AuthOtpChannel,
  AuthOtpPurpose,
  AuthResponse,
  AuthUser,
  RequestOtpResponse,
} from '@/lib/types';
import { apiRequest } from '@/shared/api/http-client';

export type RequestOtpPayload = {
  channel: AuthOtpChannel;
  purpose: AuthOtpPurpose;
  email: string;
  phone?: string;
  name?: string;
};

export type VerifyOtpPayload = {
  channel: AuthOtpChannel;
  purpose: AuthOtpPurpose;
  email: string;
  phone?: string;
  code: string;
};

export async function requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
  return apiRequest<RequestOtpResponse>('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      email: payload.email.trim(),
      phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
      name: payload.name?.trim() ? payload.name.trim() : undefined,
    }),
  });
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      email: payload.email.trim(),
      phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
      code: payload.code.trim(),
    }),
  });
}

export async function fetchAuthenticatedUser(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me', undefined, token);
}
