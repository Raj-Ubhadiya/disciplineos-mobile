import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { getVisibleHabits } from '@/features/workspace/workspace-selectors';
import { useCompleteHabitMutation } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, DevErrorPanel, ScreenContainer, SectionHeader } from '@/shared/ui';

export function HabitsScreen() {
  const router = useRouter();
  const { isLoading, token, user, workspace } = useProtectedWorkspace();
  const completeHabitMutation = useCompleteHabitMutation(token ?? '');

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

  const habits = getVisibleHabits(workspace);
  const strongestStreak = workspace.habits.reduce(
    (current, habit) => (habit.currentStreak > current ? habit.currentStreak : current),
    0,
  );
  const freshHabits = workspace.habits.filter((habit) => habit.currentStreak <= 2).length;

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Habits</Text>
        <Text style={styles.title}>Keep today&apos;s repeats easy.</Text>
        <Text style={styles.copy}>
          Habits work better on mobile when the screen is simple: see the list, complete the next one, move on.
        </Text>
        <AppButton onPress={() => router.push('/habits/form' as never)}>Create habit</AppButton>
      </AppCard>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Visible now</Text>
          <Text style={styles.metricValue}>{habits.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Best streak</Text>
          <Text style={styles.metricValue}>{strongestStreak}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Need momentum</Text>
          <Text style={styles.metricValue}>{freshHabits}</Text>
        </View>
      </View>

      <DevErrorPanel
        title="Habits debug"
        error={completeHabitMutation.error instanceof Error ? completeHabitMutation.error.message : null}
        hint="Use this panel if quick-complete fails on your phone."
      />

      <AppCard>
        <SectionHeader
          eyebrow="List"
          title="Small loops worth closing"
          subtitle="Finish directly from mobile when that removes friction."
        />
        {habits.length ? (
          habits.map((habit) => (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitCopy}>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitMeta}>
                  {habit.frequency ?? 'Daily rhythm'} . {habit.currentStreak} day streak
                  {habit.reminderTime ? ` . ${habit.reminderTime}` : ''}
                </Text>
              </View>
              <AppButton
                variant="ghost"
                loading={completeHabitMutation.isPending}
                onPress={() => completeHabitMutation.mutate({ habitId: habit.id, input: { note: 'Completed from habits screen' } })}
              >
                Complete
              </AppButton>
              <AppButton variant="ghost" onPress={() => router.push({ pathname: '/habits/[id]', params: { id: habit.id } } as never)}>Details</AppButton>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>No habits yet. Start with one routine that supports your main goal.</Text>
        )}
      </AppCard>

      <AppButton variant="secondary" onPress={() => router.push('/today')}>
        Back to today
      </AppButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: disciplineTheme.spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  habitCard: {
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
  habitCopy: {
    flex: 1,
    gap: 4,
  },
  habitTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  habitMeta: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
