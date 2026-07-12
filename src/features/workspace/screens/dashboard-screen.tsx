import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { formatDate, formatMinutes } from '@/features/workspace/lib/formatters';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, DevErrorPanel, ScreenContainer, SectionHeader, StatBlock } from '@/shared/ui';

export function DashboardScreen() {
  const router = useRouter();
  const { error, isLoading, user, workspace, workspaceQuery } = useProtectedWorkspace();

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
          <ActivityIndicator color={disciplineTheme.colors.primary} />
          <Text style={styles.stateTitle}>Loading your workspace</Text>
          <Text style={styles.stateCopy}>Preparing your plan, habits, and focus summary.</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!user || !workspace) {
    return null;
  }

  const greetingName = user.name?.split(' ')[0] ?? 'there';
  const dailyPlan = workspace.dailyPlan;
  const progressDone = dailyPlan?.focusMinutesDone ?? 0;
  const progressTarget = dailyPlan?.focusMinutes ?? workspace.profile?.dailyFocusMinutes ?? 60;
  const progressPercent = Math.min(Math.round((progressDone / Math.max(progressTarget, 1)) * 100), 100);
  const todayHabitsDone = workspace.habits.filter((habit) => habit.currentStreak > 0).length;
  const recentFocus = workspace.focusSessions[0] ?? null;
  const recentReflection = workspace.reflections[0] ?? null;
  const nextHabit = dailyPlan?.nextHabits[0] ?? workspace.habits[0] ?? null;
  const nextSteps = [
    dailyPlan?.primaryGoal?.title ?? 'Choose one clear goal for today.',
    nextHabit ? `Complete ${nextHabit.title}.` : 'Complete one habit that supports your goal.',
    recentFocus ? `Protect another ${formatMinutes(recentFocus.durationMinutes)} block.` : 'Start one focused work block.',
  ];

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      {error ? (
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton variant="secondary" onPress={() => void workspaceQuery.refetch()}>
            Try again
          </AppButton>
        </AppCard>
      ) : null}

      <AppCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.eyebrow}>Workspace</Text>
            <Text style={styles.heroTitle}>Welcome back, {greetingName}.</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{formatDate(new Date().toISOString())}</Text>
          </View>
        </View>

        <Text style={styles.heroCopy}>
          {dailyPlan?.headline ?? 'Your mobile workspace should answer one question fast: what matters next?'}
        </Text>

        <View style={styles.progressShell}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Today focus progress</Text>
            <Text style={styles.progressValue}>
              {progressDone}/{progressTarget} min
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.heroActionRow}>
          <AppButton onPress={() => router.push('/today')}>Open today</AppButton>
          <AppButton variant="secondary" onPress={() => router.push('/focus')}>
            Log focus
          </AppButton>
        </View>
      </AppCard>

      <View style={styles.statGrid}>
        <StatBlock
          label="Goals"
          value={String(workspace.goals.length)}
          detail={dailyPlan?.primaryGoal?.title ?? 'Set one main direction.'}
        />
        <StatBlock
          label="Habits"
          value={String(todayHabitsDone)}
          detail={`${workspace.habits.length} active in your workspace.`}
          tone="success"
        />
        <StatBlock
          label="Focus"
          value={`${progressPercent}%`}
          detail={`${progressDone} of ${progressTarget} minutes protected.`}
          tone="warning"
        />
      </View>

      <DevErrorPanel
        title="Workspace debug"
        error={error}
        hint="If this screen does not refresh correctly, compare this message with the Expo and backend terminals."
      />

      <AppCard>
        <SectionHeader
          eyebrow="Next"
          title="What to do now"
          subtitle="Keep the signed-in home practical: a few clear actions and no extra noise."
        />
        <View style={styles.stepStack}>
          {nextSteps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Today"
          title={dailyPlan?.primaryGoal?.title ?? 'No priority goal selected yet'}
          subtitle={
            dailyPlan?.primaryGoal?.whyItMatters ??
            'Add one meaningful target so the day has a clear anchor.'
          }
          action={
            <Text onPress={() => router.push('/today')} style={styles.inlineLink}>
              Open
            </Text>
          }
        />
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Next habit</Text>
            <Text style={styles.summaryValue}>{nextHabit?.title ?? 'No habit selected yet'}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Focus target</Text>
            <Text style={styles.summaryValue}>{progressTarget} minutes</Text>
          </View>
        </View>
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Recent"
          title="Latest activity"
          subtitle="A light summary is enough here. Details can stay inside each tab."
        />
        <View style={styles.activityStack}>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Focus</Text>
            <Text style={styles.activityValue}>
              {recentFocus
                ? `${recentFocus.title} - ${formatMinutes(recentFocus.durationMinutes)}`
                : 'No focus session logged yet'}
            </Text>
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Reflection</Text>
            <Text style={styles.activityValue}>
              {recentReflection?.tomorrowCommitment ??
                recentReflection?.wins ??
                'No reflection added yet'}
            </Text>
          </View>
        </View>
      </AppCard>

      <Text style={styles.footerNote}>DisciplineOS AI</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: disciplineTheme.spacing.lg,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 10,
  },
  stateTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  stateCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  errorCard: {
    borderColor: disciplineTheme.colors.danger,
    backgroundColor: disciplineTheme.colors.dangerSoft,
  },
  errorText: {
    color: disciplineTheme.colors.danger,
    fontSize: 14,
    lineHeight: 22,
  },
  heroCard: {
    gap: disciplineTheme.spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  eyebrow: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
    letterSpacing: -1,
  },
  heroPill: {
    borderRadius: disciplineTheme.radius.pill,
    backgroundColor: disciplineTheme.colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPillText: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 16,
    lineHeight: 26,
  },
  progressShell: {
    gap: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  progressLabel: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  progressValue: {
    color: disciplineTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 12,
    borderRadius: disciplineTheme.radius.pill,
    overflow: 'hidden',
    backgroundColor: '#e9eef8',
  },
  progressFill: {
    height: '100%',
    borderRadius: disciplineTheme.radius.pill,
    backgroundColor: disciplineTheme.colors.primary,
  },
  heroActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: disciplineTheme.spacing.sm,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: disciplineTheme.spacing.sm,
  },
  stepStack: {
    gap: disciplineTheme.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: disciplineTheme.spacing.md,
    borderRadius: disciplineTheme.radius.lg,
    backgroundColor: disciplineTheme.colors.surfaceMuted,
    padding: disciplineTheme.spacing.md,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: disciplineTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disciplineTheme.colors.primarySoft,
  },
  stepBadgeText: {
    color: disciplineTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: disciplineTheme.colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  inlineLink: {
    color: disciplineTheme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryGrid: {
    gap: disciplineTheme.spacing.sm,
  },
  summaryBlock: {
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surfaceMuted,
    padding: disciplineTheme.spacing.md,
    gap: 6,
  },
  summaryLabel: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryValue: {
    color: disciplineTheme.colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  activityStack: {
    gap: disciplineTheme.spacing.sm,
  },
  activityRow: {
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    paddingBottom: disciplineTheme.spacing.md,
  },
  activityLabel: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  activityValue: {
    color: disciplineTheme.colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  footerNote: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: disciplineTheme.spacing.xl,
  },
});
