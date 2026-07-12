import type { ApiHealthResponse } from '@/lib/types';
import { getApiV1BaseUrl } from '@/config/env';

export async function fetchHealth(): Promise<ApiHealthResponse | null> {
  try {
    const response = await fetch(`${getApiV1BaseUrl()}/health`);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiHealthResponse;
  } catch {
    return null;
  }
}
