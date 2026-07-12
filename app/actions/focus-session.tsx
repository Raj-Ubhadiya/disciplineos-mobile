import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { FocusSessionActionForm } from '@/features/workspace/components/action-forms';
import { ActionScreenShell } from '@/features/workspace/components/action-screen-shell';
import { useWorkspaceQuery } from '@/features/workspace/workspace-query';

export default function FocusSessionScreen() {
  const router = useRouter();
  const { isBooting, token, user } = useAuth();
  const workspaceQuery = useWorkspaceQuery(token);

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
      eyebrow="Focus"
      title="Log a focus session"
      description="Capture real attention invested in the right thing so your mobile workspace shows proof, not intent."
    >
      {workspaceQuery.isLoading ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color="#fdf6eb" />
          <Text style={styles.loadingText}>Loading goals and habits...</Text>
        </View>
      ) : workspaceQuery.data ? (
        <FocusSessionActionForm
          goals={workspaceQuery.data.goals}
          habits={workspaceQuery.data.habits}
          token={token}
        />
      ) : (
        <Text style={styles.loadingText}>Workspace data is not available right now.</Text>
      )}
    </ActionScreenShell>
  );
}

const styles = StyleSheet.create({
  loadingBlock: {
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#fef8ef',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
