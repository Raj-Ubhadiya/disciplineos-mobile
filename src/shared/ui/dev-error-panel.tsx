import { StyleSheet, Text, View } from 'react-native';

import { getApiConnectionInfo } from '@/config/env';
import { disciplineTheme } from '@/shared/theme';

import { AppCard } from './card';

export function DevErrorPanel({
  title = 'Development debug',
  error,
  hint,
}: {
  title?: string;
  error?: string | null;
  hint?: string | null;
}) {
  if (!__DEV__) {
    return null;
  }

  const apiConnection = getApiConnectionInfo();

  return (
    <AppCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DEV</Text>
        </View>
      </View>
      <Text style={styles.label}>Configured API</Text>
      <Text style={styles.value}>{apiConnection.configuredUrl}</Text>
      <Text style={styles.label}>Resolved API</Text>
      <Text style={styles.value}>{apiConnection.resolvedUrl}</Text>
      {apiConnection.note ? <Text style={styles.note}>{apiConnection.note}</Text> : null}
      {error ? (
        <>
          <Text style={styles.label}>Latest error</Text>
          <Text style={styles.error}>{error}</Text>
        </>
      ) : null}
      <Text style={styles.hint}>
        {hint ?? 'Keep the Expo terminal and backend terminal open while testing to compare frontend and API logs.'}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: disciplineTheme.colors.warning,
    backgroundColor: '#fffaf0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  eyebrow: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  badge: {
    borderRadius: disciplineTheme.radius.pill,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#9a3412',
    fontSize: 11,
    fontWeight: '800',
  },
  label: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    color: disciplineTheme.colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  note: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 13,
    lineHeight: 20,
  },
  error: {
    color: disciplineTheme.colors.danger,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  hint: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
