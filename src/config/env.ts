import { Platform } from 'react-native';

const fallbackApiUrl = 'http://localhost:4000';
const androidEmulatorLoopback = '10.0.2.2';

function normalizeLoopbackHost(host: string) {
  if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
    return androidEmulatorLoopback;
  }

  return host;
}

export function getApiBaseUrl() {
  const rawUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? fallbackApiUrl;

  try {
    const parsedUrl = new URL(rawUrl);
    parsedUrl.hostname = normalizeLoopbackHost(parsedUrl.hostname);
    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    return rawUrl;
  }
}

export function getApiV1BaseUrl() {
  const normalizedUrl = getApiBaseUrl();

  if (normalizedUrl.endsWith('/api/v1')) {
    return normalizedUrl;
  }

  if (normalizedUrl.endsWith('/api')) {
    return `${normalizedUrl}/v1`;
  }

  return `${normalizedUrl}/api/v1`;
}

export function getApiConnectionInfo() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? fallbackApiUrl;
  const resolvedUrl = getApiBaseUrl();
  const isLoopbackConfigured =
    configuredUrl.includes('localhost') || configuredUrl.includes('127.0.0.1');

  return {
    configuredUrl,
    resolvedUrl,
    note:
      Platform.OS === 'android' && isLoopbackConfigured
        ? 'Android emulator loopback is mapped to 10.0.2.2 automatically.'
        : isLoopbackConfigured
          ? 'Loopback works on simulators, but physical devices need a LAN IP or tunnel URL.'
          : null,
  };
}
