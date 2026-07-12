import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { useWorkspaceQuery } from '@/features/workspace/workspace-query';

function isUnauthorizedError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes('unauthorized') || normalized.includes('401');
}

export function useProtectedWorkspace() {
  const router = useRouter();
  const auth = useAuth();
  const workspaceQuery = useWorkspaceQuery(auth.token);

  useEffect(() => {
    if (!auth.isBooting && !auth.user) {
      router.replace('/');
    }
  }, [auth.isBooting, auth.user, router]);

  useEffect(() => {
    const message = workspaceQuery.error instanceof Error ? workspaceQuery.error.message : null;

    if (message && isUnauthorizedError(message)) {
      void auth.signOut();
      router.replace('/');
    }
  }, [auth, router, workspaceQuery.error]);

  return {
    ...auth,
    workspaceQuery,
    workspace: workspaceQuery.data ?? null,
    isLoading: auth.isBooting || (Boolean(auth.token) && workspaceQuery.isLoading),
    error: auth.error ?? (workspaceQuery.error instanceof Error ? workspaceQuery.error.message : null),
  };
}
