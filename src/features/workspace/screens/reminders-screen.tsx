import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { WorkspaceActions } from '@/features/workspace/components/workspace-actions';
import { ReminderList } from '@/features/workspace/components/reminder-ui';
import { GlassCard } from '@/features/workspace/components/workspace-ui';
import { useWorkspaceQuery } from '@/features/workspace/workspace-query';
import { DevErrorPanel } from '@/shared/ui';

export function RemindersScreen() {
  const router = useRouter();
  const { isBooting, token, user } = useAuth();
  const workspaceQuery = useWorkspaceQuery(token);

  useEffect(() => {
    if (!isBooting && !user) {
      router.replace('/');
    }
  }, [isBooting, router, user]);

  if (isBooting || workspaceQuery.isLoading) {
    return (
      <LinearGradient colors={['#10203b', '#1a3a70', '#2b5a9b']} style={styles.page}>
        <SafeAreaView style={styles.centeredSafeArea}>
          <ActivityIndicator color="#fdf6eb" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!token) {
    return null;
  }

  const workspaceError =
    workspaceQuery.error instanceof Error ? workspaceQuery.error.message : null;
  const reminders = workspaceQuery.data?.reminders ?? [];
  const upcomingReminders = workspaceQuery.data?.upcomingReminders ?? [];
  const completedCount = reminders.filter((reminder) => reminder.status === 'completed').length;

  return (
    <LinearGradient colors={['#10203b', '#1a3a70', '#2b5a9b']} style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Reminders</Text>
            <Text style={styles.title}>Stay nudged before the day drifts</Text>
            <Text style={styles.copy}>
              Upcoming reminders should help you start the right thing at the right time, not feel like noise.
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{upcomingReminders.length}</Text>
                <Text style={styles.summaryLabel}>Upcoming</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{completedCount}</Text>
                <Text style={styles.summaryLabel}>Completed</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{reminders.length}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>
          </View>

          <WorkspaceActions />

          <DevErrorPanel
            title="Reminders debug"
            error={workspaceError}
            hint="If reminders do not load or complete, compare this message with the Expo and backend terminals."
          />

          <GlassCard>
            <ReminderList
              emptyCopy="No upcoming reminders in the next seven days."
              reminders={upcomingReminders}
              title="Upcoming and pending"
              token={token}
            />
          </GlassCard>

          <GlassCard>
            <ReminderList
              emptyCopy="No reminders have been created yet."
              reminders={reminders}
              title="Recent reminder list"
              token={token}
            />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  safeArea: { flex: 1 },
  centeredSafeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120, gap: 18 },
  hero: {
    borderRadius: 28,
    backgroundColor: '#f7efe1',
    padding: 22,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#e8eefb',
    padding: 14,
    gap: 4,
  },
  summaryValue: {
    color: '#102244',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#56657b',
    fontSize: 12,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#a66222',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#102244',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
  },
  copy: {
    color: '#546277',
    fontSize: 15,
    lineHeight: 24,
  },
});
