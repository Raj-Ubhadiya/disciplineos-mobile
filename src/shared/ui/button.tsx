import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { disciplineTheme } from '@/shared/theme';

export function AppButton({
  children,
  variant = 'primary',
  loading = false,
  style,
  disabled,
  onPress,
}: PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
}>) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? disciplineTheme.colors.primaryText : disciplineTheme.colors.primary} />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: disciplineTheme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: disciplineTheme.spacing.lg,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    borderColor: disciplineTheme.colors.primary,
    backgroundColor: disciplineTheme.colors.primary,
  },
  secondary: {
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surface,
  },
  ghost: {
    borderColor: 'transparent',
    backgroundColor: disciplineTheme.colors.primarySoft,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: disciplineTheme.colors.primaryText,
  },
  secondary: {
    color: disciplineTheme.colors.text,
  },
  ghost: {
    color: disciplineTheme.colors.primary,
  },
});
