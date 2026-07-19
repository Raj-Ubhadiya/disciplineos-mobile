import type { PropsWithChildren, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { disciplineTheme } from '@/shared/theme';

export function ScreenContainer({
  children,
  header,
  scroll = true,
  contentStyle,
  refreshing = false,
  onRefresh,
}: PropsWithChildren<{
  header?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[disciplineTheme.colors.primary]} /> : undefined}
        >
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
