import * as SecureStore from 'expo-secure-store';

const storageKey = 'disciplineos.mobile.token';

export async function readAccessToken() {
  return SecureStore.getItemAsync(storageKey);
}

export async function writeAccessToken(token: string) {
  await SecureStore.setItemAsync(storageKey, token);
}

export async function clearAccessToken() {
  await SecureStore.deleteItemAsync(storageKey);
}
