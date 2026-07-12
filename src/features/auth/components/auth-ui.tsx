import { StyleSheet, Text, View } from 'react-native';

import { disciplineTheme } from '@/shared/theme';

export function AuthBanner({
  tone,
  text,
}: {
  tone: 'error' | 'info';
  text: string;
}) {
  return (
    <View style={[styles.banner, tone === 'error' ? styles.errorBanner : styles.infoBanner]}>
      <Text style={styles.bannerText}>{text}</Text>
    </View>
  );
}

export const authUiStyles = StyleSheet.create({
  fieldLabel: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  fieldHint: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    color: disciplineTheme.colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
});

const styles = StyleSheet.create({
  banner: {
    borderRadius: disciplineTheme.radius.lg,
    paddingHorizontal: disciplineTheme.spacing.md,
    paddingVertical: 12,
  },
  errorBanner: {
    backgroundColor: disciplineTheme.colors.dangerSoft,
  },
  infoBanner: {
    backgroundColor: disciplineTheme.colors.primarySoft,
  },
  bannerText: {
    color: disciplineTheme.colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
});
