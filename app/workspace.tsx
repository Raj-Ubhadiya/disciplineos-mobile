import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { readLastWorkspaceRoute } from '@/shared/preferences/navigation-preferences';

export default function WorkspaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToLastWorkspaceRoute() {
      router.replace(await readLastWorkspaceRoute());
    }

    void redirectToLastWorkspaceRoute();
  }, [router]);

  return null;
}
