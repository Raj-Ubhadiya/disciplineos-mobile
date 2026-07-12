import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { GoalActionForm } from '@/features/workspace/components/action-forms';
import { ActionScreenShell } from '@/features/workspace/components/action-screen-shell';

export default function NewGoalScreen() {
  const router = useRouter();
  const { isBooting, token, user } = useAuth();

  useEffect(() => {
    if (!isBooting && (!user || !token)) {
      router.replace('/');
    }
  }, [isBooting, router, token, user]);

  if (!token || !user) {
    return null;
  }

  return (
    <ActionScreenShell
      eyebrow="Goal"
      title="Create one clear goal"
      description="Give the workspace a direction that is easy to protect and easy to act on."
    >
      <GoalActionForm token={token} />
    </ActionScreenShell>
  );
}
