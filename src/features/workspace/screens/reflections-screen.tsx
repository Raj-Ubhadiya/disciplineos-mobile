import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { formatDate } from '@/features/workspace/lib/formatters';
import { useCreateReflectionMutation } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, DevErrorPanel, FormField, ScreenContainer, SectionHeader, StatBlock } from '@/shared/ui';

export function ReflectionsScreen() {
  const { isLoading, token, user, workspace } = useProtectedWorkspace();
  const createReflectionMutation = useCreateReflectionMutation(token ?? '');
  const [mood, setMood] = useState('focused');
  const [wins, setWins] = useState('');
  const [blockers, setBlockers] = useState('');
  const [distractions, setDistractions] = useState('');
  const [tomorrowCommitment, setTomorrowCommitment] = useState('');
  const [focusScore, setFocusScore] = useState('70');
  const [localError, setLocalError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator color={disciplineTheme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!user || !token || !workspace) {
    return null;
  }

  function submit() {
    setLocalError(null);
    const parsedScore = Number(focusScore);

    if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setLocalError('Focus score must be between 0 and 100.');
      return;
    }

    createReflectionMutation.mutate(
      {
        mood: mood.trim() || 'focused',
        focusScore: parsedScore,
        ...(wins.trim() ? { wins: wins.trim() } : {}),
        ...(blockers.trim() ? { blockers: blockers.trim() } : {}),
        ...(distractions.trim() ? { distractions: distractions.trim() } : {}),
        ...(tomorrowCommitment.trim()
          ? { tomorrowCommitment: tomorrowCommitment.trim() }
          : {}),
      },
      {
        onSuccess: () => {
          setWins('');
          setBlockers('');
          setDistractions('');
          setTomorrowCommitment('');
          setFocusScore('70');
        },
      },
    );
  }

  return (
    <ScreenContainer
      header={
        <AppCard tone="hero">
          <Text style={styles.eyebrow}>Reflections</Text>
          <Text style={styles.title}>End the day with clarity</Text>
          <Text style={styles.copy}>Keep it short, honest, and useful. The same reflection data feeds your web workspace too.</Text>
        </AppCard>
      }
    >
      <View style={styles.statGrid}>
        <StatBlock
          label="Average score"
          value={String(workspace.reflectionSummary?.averageFocusScore ?? 0)}
          detail="Recent reflection average."
        />
        <StatBlock
          label="Latest mood"
          value={workspace.reflectionSummary?.latestMood ?? 'N/A'}
          detail="Most recent check-in."
          tone="success"
        />
      </View>

      <DevErrorPanel
        title="Reflections debug"
        error={
          localError ??
          (createReflectionMutation.error instanceof Error
            ? createReflectionMutation.error.message
            : null)
        }
        hint="If saving a reflection fails, the most recent submit or validation error will appear here."
      />

      <AppCard>
        <SectionHeader
          eyebrow="New reflection"
          title="Save tonight's review"
          subtitle="Preserve the same purpose as web, simplified for a phone."
        />
        <FormField label="Mood">
          <AppInput value={mood} onChangeText={setMood} placeholder="focused" />
        </FormField>
        <FormField label="Wins">
          <AppInput multiline value={wins} onChangeText={setWins} placeholder="What worked well?" />
        </FormField>
        <FormField label="Blockers">
          <AppInput multiline value={blockers} onChangeText={setBlockers} placeholder="What got in the way?" />
        </FormField>
        <FormField label="Distractions">
          <AppInput multiline value={distractions} onChangeText={setDistractions} placeholder="What pulled attention away?" />
        </FormField>
        <FormField label="Tomorrow commitment">
          <AppInput multiline value={tomorrowCommitment} onChangeText={setTomorrowCommitment} placeholder="What should tomorrow start with?" />
        </FormField>
        <FormField label="Focus score" error={localError}>
          <AppInput value={focusScore} onChangeText={setFocusScore} keyboardType="number-pad" placeholder="70" />
        </FormField>
        <AppButton loading={createReflectionMutation.isPending} onPress={submit}>
          Save reflection
        </AppButton>
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Recent reflections"
          title="Your latest reviews"
          subtitle="A lighter mobile list of the same backend records."
        />
        {workspace.reflections.length ? (
          workspace.reflections.map((reflection) => (
            <View key={reflection.id} style={styles.reflectionCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.reflectionMood}>{reflection.mood}</Text>
                <Text style={styles.reflectionDate}>{formatDate(reflection.createdAt)}</Text>
              </View>
              <Text style={styles.reflectionCopy}>
                {reflection.wins ?? reflection.tomorrowCommitment ?? 'Reflection saved.'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>No reflections yet. Start with a two-line review.</Text>
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 120 },
  eyebrow: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: disciplineTheme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
  },
  copy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: disciplineTheme.spacing.sm,
  },
  reflectionCard: {
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surfaceMuted,
    padding: disciplineTheme.spacing.md,
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  reflectionMood: {
    color: disciplineTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  reflectionDate: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
  },
  reflectionCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
