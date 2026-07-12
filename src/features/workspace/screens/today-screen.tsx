import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { formatDateTime } from '@/features/workspace/lib/formatters';
import { useCompleteHabitMutation, useCompleteReminderMutation } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, DevErrorPanel, ScreenContainer, SectionHeader } from '@/shared/ui';

export function TodayScreen() {
  const router = useRouter();
  const { error, isLoading, token, user, workspace } = useProtectedWorkspace();
  const completeHabitMutation = useCompleteHabitMutation(token ?? '');
  const completeReminderMutation = useCompleteReminderMutation(token ?? '');

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator color={disciplineTheme.colors.primary} />
          <Text style={styles.loadingTitle}>Loading today&apos;s plan</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!user || !token || !workspace) {
    return null;
  }

  const { dailyPlan } = workspace;
  const actionSteps = dailyPlan?.actionSteps.length
    ? dailyPlan.actionSteps
    : [
        'Choose one meaningful priority goal.',
        'Protect a focused work block.',
        'Complete one habit that proves the day has started well.',
        'Write a short evening reflection.',
      ];
  const progressTarget = dailyPlan?.focusMinutes ?? workspace.profile?.dailyFocusMinutes ?? 60;
  const progressDone = dailyPlan?.focusMinutesDone ?? 0;
  const progressPercent = Math.min(Math.round((progressDone / Math.max(progressTarget, 1)) * 100), 100);
  const mutationError =
    completeHabitMutation.error instanceof Error
      ? completeHabitMutation.error.message
      : completeReminderMutation.error instanceof Error
        ? completeReminderMutation.error.message
        : null;

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.title}>{dailyPlan?.headline ?? 'Start with one clear action.'}</Text>
        <Text style={styles.copy}>
          {dailyPlan?.primaryGoal?.whyItMatters ??
            'Move through the day in a simple order: start, focus, finish, reflect.'}
        </Text>

        <View style={styles.progressShell}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Focus progress</Text>
            <Text style={styles.progressValue}>
              {progressDone}/{progressTarget} min
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.actionRow}>
          <AppButton onPress={() => router.push('/actions/focus-session')}>Log focus</AppButton>
          <AppButton variant="secondary" onPress={() => router.push('/reflections')}>
            Reflect
          </AppButton>
        </View>
      </AppCard>

      {error ? (
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </AppCard>
      ) : null}

      <DevErrorPanel
        title="Today debug"
        error={error ?? mutationError}
        hint="If a habit or reminder action fails, the latest backend message will appear here during testing."
      />

      <AppCard>
        <SectionHeader
          eyebrow="Plan"
          title="What matters in order"
          subtitle="Keep the daily flow small enough to follow without extra thinking."
        />
        <View style={styles.stepStack}>
          {actionSteps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepCopy}>{step}</Text>
            </View>
          ))}
        </View>
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Goal"
          title={dailyPlan?.primaryGoal?.title ?? 'No priority goal selected yet'}
          subtitle={dailyPlan?.primaryGoal?.whyItMatters ?? 'Choose one target that gives the day a clear direction.'}
        />
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Habits"
          title="Close one small loop"
          subtitle="The fastest win is usually one habit completed early."
        />
        {workspace.habits.length ? (
          workspace.habits.slice(0, 4).map((habit) => (
            <View key={habit.id} style={styles.itemCard}>
              <View style={styles.itemCopy}>
                <Text style={styles.itemTitle}>{habit.title}</Text>
                <Text style={styles.itemMeta}>
                  {habit.frequency ?? 'Daily'} . {habit.currentStreak} day streak
                </Text>
              </View>
              <AppButton
                variant="ghost"
                loading={completeHabitMutation.isPending}
                onPress={() => completeHabitMutation.mutate({ habitId: habit.id, input: { note: 'Completed from mobile' } })}
              >
                Complete
              </AppButton>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>No habits yet. Add one repeatable action that supports your main goal.</Text>
        )}
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Reminders"
          title="What needs attention"
          subtitle="Upcoming reminders, simplified for quick review."
          action={
            <Text onPress={() => router.push('/actions/new-reminder')} style={styles.inlineLink}>
              New
            </Text>
          }
        />
        {(workspace.upcomingReminders.length ? workspace.upcomingReminders : workspace.reminders).slice(0, 4).map((reminder) => (
          <View key={reminder.id} style={styles.itemCard}>
            <View style={styles.itemCopy}>
              <Text style={styles.itemTitle}>{reminder.title}</Text>
              <Text style={styles.itemMeta}>{formatDateTime(reminder.scheduledAt)}</Text>
            </View>
            <AppButton
              variant="ghost"
              loading={completeReminderMutation.isPending}
              onPress={() => completeReminderMutation.mutate({ reminderId: reminder.id })}
            >
              Done
            </AppButton>
          </View>
        ))}
        {!workspace.reminders.length && !workspace.upcomingReminders.length ? (
          <Text style={styles.emptyCopy}>No reminders scheduled yet.</Text>
        ) : null}
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
    gap: 8,
  },
  loadingTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    gap: disciplineTheme.spacing.lg,
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
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: disciplineTheme.spacing.sm,
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
  stepCopy: {
    flex: 1,
    color: disciplineTheme.colors.text,
    fontSize: 15,
    lineHeight: 23,
  },
  itemCard: {
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
  itemCopy: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  itemMeta: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  inlineLink: {
    color: disciplineTheme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
