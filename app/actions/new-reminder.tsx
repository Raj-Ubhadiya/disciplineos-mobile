import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { ReminderActionForm } from '@/features/workspace/components/action-forms';
import { ActionScreenShell } from '@/features/workspace/components/action-screen-shell';

export default function NewReminderScreen() {
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
      eyebrow="Reminder"
      title="Create a reminder"
      description="Set one specific nudge so your future self sees the right prompt before the day gets noisy."
    >
      <ReminderActionForm token={token} />
    </ActionScreenShell>
  );
}
