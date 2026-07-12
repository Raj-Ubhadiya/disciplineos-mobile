import type { PropsWithChildren, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { disciplineTheme } from '@/shared/theme';

export function ScreenContainer({
  children,
  header,
  scroll = true,
  contentStyle,
}: PropsWithChildren<{
  header?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: disciplineTheme.colors.background,
  },
  scrollContent: {
    paddingBottom: disciplineTheme.spacing.xxl * 2,
  },
  content: {
    paddingHorizontal: disciplineTheme.spacing.lg,
    paddingTop: disciplineTheme.spacing.md,
    gap: disciplineTheme.spacing.lg,
  },
});
