import type { AuthOtpChannel, AuthOtpPurpose, AuthUser } from '@/lib/types';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { clearAccessToken, readAccessToken, writeAccessToken } from '@/features/auth/auth-storage';
import {
  fetchAuthenticatedUser,
  requestOtp,
  verifyOtp,
  type RequestOtpPayload,
  type VerifyOtpPayload,
} from '@/features/auth/auth-service';

export type PendingOtpSession = {
  channel: AuthOtpChannel;
  purpose: AuthOtpPurpose;
  email: string;
  phone?: string;
  name?: string;
};

type AuthContextValue = {
  isBooting: boolean;
  isAuthenticating: boolean;
  token: string | null;
  user: AuthUser | null;
  error: string | null;
  pendingOtpSession: PendingOtpSession | null;
  requestOtpCode: (payload: RequestOtpPayload) => Promise<void>;
  resendOtpCode: () => Promise<void>;
  verifyOtpCode: (payload: Pick<VerifyOtpPayload, 'code'>) => Promise<void>;
  signOut: () => Promise<void>;
  clearPendingOtpSession: () => void;
  clearError: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingOtpSession, setPendingOtpSession] = useState<PendingOtpSession | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const savedToken = await readAccessToken();

        if (!savedToken) {
          return;
        }

        const authenticatedUser = await fetchAuthenticatedUser(savedToken);

        if (!isMounted) {
          return;
        }

        setToken(savedToken);
        setUser(authenticatedUser);
      } catch (sessionError) {
        await clearAccessToken();

        if (isMounted) {
          setError(
            sessionError instanceof Error ? sessionError.message : 'Failed to restore session.',
          );
        }
      } finally {
        if (isMounted) {
          setIsBooting(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function applyAuthenticatedSession(nextToken: string, nextUser: AuthUser) {
    await writeAccessToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setError(null);
  }

  async function requestOtpCode(payload: RequestOtpPayload) {
    setIsAuthenticating(true);

    try {
      await requestOtp(payload);
      setPendingOtpSession({
        channel: payload.channel,
        purpose: payload.purpose,
        email: payload.email.trim(),
        ...(payload.phone?.trim() ? { phone: payload.phone.trim() } : {}),
        ...(payload.name?.trim() ? { name: payload.name.trim() } : {}),
      });
      setError(null);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Failed to request OTP.');
      throw authError;
    } finally {
      setIsAuthenticating(false);
      setIsBooting(false);
    }
  }

  async function resendOtpCode() {
    if (!pendingOtpSession) {
      const missingSessionError = new Error('Start with login or signup before requesting a new code.');
      setError(missingSessionError.message);
      throw missingSessionError;
    }

    setIsAuthenticating(true);

    try {
      await requestOtp(pendingOtpSession);
      setError(null);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Failed to resend OTP.');
      throw authError;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function verifyOtpCode(payload: Pick<VerifyOtpPayload, 'code'>) {
    if (!pendingOtpSession) {
      const missingSessionError = new Error('Your verification details expired. Please request a new code.');
      setError(missingSessionError.message);
      throw missingSessionError;
    }

    setIsAuthenticating(true);

    try {
      const response = await verifyOtp({
        ...pendingOtpSession,
        code: payload.code,
      });
      await applyAuthenticatedSession(response.accessToken, response.user);
      setPendingOtpSession(null);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'OTP verification failed.');
      throw authError;
    } finally {
      setIsAuthenticating(false);
      setIsBooting(false);
    }
  }

  async function signOut() {
    await clearAccessToken();
    setToken(null);
    setUser(null);
    setError(null);
    setPendingOtpSession(null);
    setIsBooting(false);
  }

  function clearPendingOtpSession() {
    setPendingOtpSession(null);
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isBooting,
        isAuthenticating,
        token,
        user,
        error,
        pendingOtpSession,
        requestOtpCode,
        resendOtpCode,
        verifyOtpCode,
        signOut,
        clearPendingOtpSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
}
