import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { formatDate, formatMinutes } from '@/features/workspace/lib/formatters';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, DevErrorPanel, ScreenContainer, SectionHeader } from '@/shared/ui';

export function FocusScreen() {
  const router = useRouter();
  const { error, isLoading, user, workspace } = useProtectedWorkspace();

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator color={disciplineTheme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!user || !workspace) {
    return null;
  }

  const summary = workspace.focusSessionSummary;
  const distractionFreeRatio =
    summary?.totalSessions && summary.totalSessions > 0
      ? Math.round(((summary.distractionFreeSessions ?? 0) / summary.totalSessions) * 100)
      : 0;

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Focus</Text>
        <Text style={styles.title}>Protect deep work.</Text>
        <Text style={styles.copy}>
          Keep this screen calm: see your recent sessions, then log the next one quickly.
        </Text>
        <View style={styles.actionRow}>
          <AppButton onPress={() => router.push('/actions/focus-session')}>Log focus session</AppButton>
          <AppButton variant="secondary" onPress={() => router.push('/today')}>
            Open today
          </AppButton>
        </View>
      </AppCard>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Sessions</Text>
          <Text style={styles.metricValue}>{summary?.totalSessions ?? workspace.focusSessions.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Minutes</Text>
          <Text style={styles.metricValue}>{summary?.totalMinutes ?? 0}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Clean ratio</Text>
          <Text style={styles.metricValue}>{distractionFreeRatio}%</Text>
        </View>
      </View>

      <DevErrorPanel
        title="Focus debug"
        error={error}
        hint="If focus history does not load, compare this panel with the backend terminal."
      />

      <AppCard>
        <SectionHeader
          eyebrow="Target"
          title={`${workspace.profile?.dailyFocusMinutes ?? 60} minutes daily`}
          subtitle="Your profile target shapes the focus rhythm here too."
        />
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="History"
          title="Recent sessions"
          subtitle="A lighter mobile version of your focus timeline."
        />
        {workspace.focusSessions.length ? (
          workspace.focusSessions.map((session) => (
            <View key={session.id} style={styles.sessionRow}>
              <View style={styles.rowCopy}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionMeta}>
                  {formatDate(session.startedAt ?? session.createdAt ?? new Date().toISOString())}
                  {' . '}
                  {session.distractionFree ? 'Distraction-free' : 'Interrupted'}
                </Text>
              </View>
              <Text style={styles.sessionDuration}>{formatMinutes(session.durationMinutes)}</Text>
              <AppButton variant="ghost" onPress={() => router.push({ pathname: '/focus-sessions/[id]', params: { id: session.id } } as never)}>Details</AppButton>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>No focus sessions yet. Log your first protected work block.</Text>
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: disciplineTheme.spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  heroCard: {
    gap: disciplineTheme.spacing.md,
  },
  eyebrow: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: disciplineTheme.colors.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  copy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: disciplineTheme.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    gap: disciplineTheme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surface,
    padding: disciplineTheme.spacing.md,
    gap: 6,
  },
  metricLabel: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricValue: {
    color: disciplineTheme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surfaceMuted,
    padding: disciplineTheme.spacing.md,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  sessionTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  sessionMeta: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  sessionDuration: {
    color: disciplineTheme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
