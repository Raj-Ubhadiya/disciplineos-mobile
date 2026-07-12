import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { disciplineTheme } from '@/shared/theme';

export function AppCard({
  children,
  tone = 'default',
  style,
}: PropsWithChildren<{
  tone?: 'default' | 'muted' | 'hero';
  style?: StyleProp<ViewStyle>;
}>) {
  return <View style={[styles.base, toneStyles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: disciplineTheme.radius.xl,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surface,
    padding: disciplineTheme.spacing.lg,
    gap: disciplineTheme.spacing.md,
    ...disciplineTheme.shadow.card,
  },
});

const toneStyles = StyleSheet.create({
  default: {},
  muted: {
    backgroundColor: disciplineTheme.colors.surfaceMuted,
  },
  hero: {
    borderColor: 'rgba(79, 70, 229, 0.18)',
    backgroundColor: disciplineTheme.colors.surface,
    ...disciplineTheme.shadow.strong,
  },
});
