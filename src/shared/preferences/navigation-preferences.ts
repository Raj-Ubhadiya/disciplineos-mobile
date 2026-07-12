import * as SecureStore from 'expo-secure-store';

const lastWorkspaceRouteKey = 'disciplineos.mobile.lastWorkspaceRoute';

const workspaceRoutes = ['/dashboard', '/today', '/habits', '/focus', '/profile'] as const;

export type WorkspaceRoute = (typeof workspaceRoutes)[number];

export function isWorkspaceRoute(value: string): value is WorkspaceRoute {
  return workspaceRoutes.includes(value as WorkspaceRoute);
}

export async function readLastWorkspaceRoute(): Promise<WorkspaceRoute> {
  const savedRoute = await SecureStore.getItemAsync(lastWorkspaceRouteKey);

  if (savedRoute && isWorkspaceRoute(savedRoute)) {
    return savedRoute;
  }

  return '/dashboard';
}

export async function writeLastWorkspaceRoute(route: WorkspaceRoute) {
  await SecureStore.setItemAsync(lastWorkspaceRouteKey, route);
}
