import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { disciplineTheme } from '@/shared/theme';

export function FormField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function AppInput({
  multiline,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & { error?: boolean }) {
  return (
    <TextInput
      placeholderTextColor={disciplineTheme.colors.textFaint}
      style={[styles.input, multiline ? styles.textArea : null, error ? styles.inputError : null]}
      multiline={multiline}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  label: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  hint: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
  },
  error: {
    color: disciplineTheme.colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    minHeight: 52,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surfaceRaised,
    paddingHorizontal: disciplineTheme.spacing.md,
    color: disciplineTheme.colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 104,
    paddingTop: disciplineTheme.spacing.md,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: disciplineTheme.colors.danger,
    backgroundColor: disciplineTheme.colors.dangerSoft,
  },
});
