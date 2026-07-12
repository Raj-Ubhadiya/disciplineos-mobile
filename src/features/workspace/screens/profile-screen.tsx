import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { getApiConnectionInfo } from '@/config/env';
import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { useUpdateProfileMutation } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, DevErrorPanel, FormField, ScreenContainer, SectionHeader } from '@/shared/ui';

export function ProfileScreen() {
  const router = useRouter();
  const { isLoading, signOut, token, user, workspace } = useProtectedWorkspace();
  const profile = workspace?.profile ?? null;
  const updateProfileMutation = useUpdateProfileMutation(token ?? '');

  const [mainDream, setMainDream] = useState('');
  const [currentLifeFocus, setCurrentLifeFocus] = useState('');
  const [biggestDistractions, setBiggestDistractions] = useState('');
  const [dailyFocusMinutes, setDailyFocusMinutes] = useState('60');
  const [preferredReminderTone, setPreferredReminderTone] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setMainDream(profile.mainDream ?? '');
    setCurrentLifeFocus(profile.currentLifeFocus ?? '');
    setBiggestDistractions(profile.biggestDistractions.join(', '));
    setDailyFocusMinutes(String(profile.dailyFocusMinutes ?? 60));
    setPreferredReminderTone(profile.preferredReminderTone ?? '');
  }, [profile]);

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

  const apiConnection = getApiConnectionInfo();
  const mutationError =
    updateProfileMutation.error instanceof Error ? updateProfileMutation.error.message : null;

  function submit() {
    setLocalError(null);
    const parsedFocusMinutes = Number(dailyFocusMinutes);

    if (!Number.isFinite(parsedFocusMinutes) || parsedFocusMinutes < 5 || parsedFocusMinutes > 1440) {
      setLocalError('Daily focus minutes must stay between 5 and 1440.');
      return;
    }

    updateProfileMutation.mutate({
      biggestDistractions: biggestDistractions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      dailyFocusMinutes: parsedFocusMinutes,
      ...(mainDream.trim() ? { mainDream: mainDream.trim() } : {}),
      ...(currentLifeFocus.trim() ? { currentLifeFocus: currentLifeFocus.trim() } : {}),
      ...(preferredReminderTone.trim()
        ? { preferredReminderTone: preferredReminderTone.trim() }
        : {}),
    });
  }

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>{user.name ?? 'Your profile'}</Text>
        <Text style={styles.copy}>
          Keep your focus target, reminder style, and personal direction aligned across mobile and web.
        </Text>
        <View style={styles.sessionRow}>
          <View style={styles.sessionCopy}>
            <Text style={styles.sessionLabel}>{user.email}</Text>
            <Text style={styles.sessionMeta}>
              {user.role}
              {user.phone ? ` . ${user.phone}` : ''}
            </Text>
          </View>
          <AppButton
            variant="secondary"
            onPress={() => {
              void signOut();
              router.replace('/');
            }}
          >
            Sign out
          </AppButton>
        </View>
      </AppCard>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Goals</Text>
          <Text style={styles.metricValue}>{workspace.goals.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Habits</Text>
          <Text style={styles.metricValue}>{workspace.habits.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Focus target</Text>
          <Text style={styles.metricValue}>{dailyFocusMinutes}</Text>
        </View>
      </View>

      <AppCard>
        <SectionHeader
          eyebrow="Preferences"
          title="Edit your real workspace profile"
          subtitle="These settings update the same backend data used by your web app and plan generation."
        />

        <FormField label="Main dream">
          <AppInput
            multiline
            value={mainDream}
            onChangeText={setMainDream}
            placeholder="What are you building toward?"
          />
        </FormField>

        <FormField label="Current life focus">
          <AppInput
            multiline
            value={currentLifeFocus}
            onChangeText={setCurrentLifeFocus}
            placeholder="What matters most right now?"
          />
        </FormField>

        <FormField label="Biggest distractions" hint="Separate items with commas.">
          <AppInput
            multiline
            value={biggestDistractions}
            onChangeText={setBiggestDistractions}
            placeholder="Instagram, random browsing, late-night YouTube"
          />
        </FormField>

        <FormField label="Daily focus minutes" error={localError}>
          <AppInput
            value={dailyFocusMinutes}
            onChangeText={setDailyFocusMinutes}
            keyboardType="number-pad"
            placeholder="60"
          />
        </FormField>

        <FormField label="Preferred reminder tone" error={mutationError}>
          <AppInput
            value={preferredReminderTone}
            onChangeText={setPreferredReminderTone}
            placeholder="Supportive"
          />
        </FormField>

        <AppButton loading={updateProfileMutation.isPending} onPress={submit}>
          Save changes
        </AppButton>
      </AppCard>

      <AppCard>
        <SectionHeader
          eyebrow="Connection"
          title="API environment"
          subtitle="Useful when testing the app on your real phone."
        />
        <View style={styles.connectionBlock}>
          <Text style={styles.connectionLabel}>Configured</Text>
          <Text style={styles.connectionValue}>{apiConnection.configuredUrl}</Text>
        </View>
        <View style={styles.connectionBlock}>
          <Text style={styles.connectionLabel}>Resolved</Text>
          <Text style={styles.connectionValue}>{apiConnection.resolvedUrl}</Text>
        </View>
        {apiConnection.note ? <Text style={styles.noteText}>{apiConnection.note}</Text> : null}
      </AppCard>

      <DevErrorPanel
        title="Profile debug"
        error={localError ?? mutationError}
        hint="This screen is still the best place to confirm the phone is pointing to the correct backend URL."
      />
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
  sessionRow: {
    gap: disciplineTheme.spacing.sm,
  },
  sessionCopy: {
    gap: 4,
  },
  sessionLabel: {
    color: disciplineTheme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  sessionMeta: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
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
  connectionBlock: {
    gap: 4,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surfaceMuted,
    padding: disciplineTheme.spacing.md,
  },
  connectionLabel: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  connectionValue: {
    color: disciplineTheme.colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  noteText: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 13,
    lineHeight: 20,
  },
});
