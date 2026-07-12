import { StyleSheet, Text, View } from 'react-native';

import { disciplineTheme } from '@/shared/theme';

export function StatBlock({
  label,
  value,
  detail,
  tone = 'brand',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, toneStyles[tone]]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surface,
    padding: disciplineTheme.spacing.md,
    gap: disciplineTheme.spacing.xs,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  label: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: disciplineTheme.spacing.xs,
  },
  value: {
    color: disciplineTheme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginLeft: disciplineTheme.spacing.xs,
  },
  detail: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: disciplineTheme.spacing.xs,
  },
});

const toneStyles = StyleSheet.create({
  brand: { backgroundColor: disciplineTheme.colors.primary },
  success: { backgroundColor: disciplineTheme.colors.success },
  warning: { backgroundColor: disciplineTheme.colors.warning },
});
