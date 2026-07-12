import { getApiV1BaseUrl } from '@/config/env';

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getApiErrorMessage(error: ApiErrorBody | null, status: number): string {
  if (!error) {
    return `Request failed: ${status}`;
  }

  if (Array.isArray(error.message)) {
    return error.message.join(' ');
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  return `Request failed: ${status}`;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${getApiV1BaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return (await response.json()) as T;
}
