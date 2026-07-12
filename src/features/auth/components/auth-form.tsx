import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthBanner, authUiStyles } from '@/features/auth/components/auth-ui';
import type {
  AuthFieldErrors,
  AuthFormValues,
  AuthMode,
} from '@/features/auth/auth-validation';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppInput } from '@/shared/ui';

export function AuthForm({
  mode,
  values,
  errors,
  isSubmitting,
  serverError,
  onModeChange,
  onChange,
  onSubmit,
}: {
  mode: AuthMode;
  values: AuthFormValues;
  errors: AuthFieldErrors;
  isSubmitting: boolean;
  serverError: string | null;
  onModeChange: (mode: AuthMode) => void;
  onChange: (field: keyof AuthFormValues, value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.authCard}>
      <View style={styles.authModeRow}>
        {(['login', 'signup'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => onModeChange(item)}
            style={[styles.authModeButton, mode === item ? styles.authModeButtonActive : null]}
          >
            <Text style={[styles.authModeText, mode === item ? styles.authModeTextActive : null]}>
              {item === 'login' ? 'Login' : 'Sign up'}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === 'signup' ? (
        <View style={styles.fieldBlock}>
          <Text style={authUiStyles.fieldLabel}>Full name</Text>
          <AppInput
            autoCapitalize="words"
            onChangeText={(value) => onChange('name', value)}
            placeholder="Full name"
            error={Boolean(errors.name)}
            value={values.name}
          />
          {errors.name ? <Text style={authUiStyles.errorText}>{errors.name}</Text> : null}
        </View>
      ) : null}

      <View style={styles.fieldBlock}>
        <Text style={authUiStyles.fieldLabel}>Email</Text>
        <AppInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value) => onChange('email', value)}
          placeholder="Email"
          error={Boolean(errors.email)}
          value={values.email}
        />
        {errors.email ? <Text style={authUiStyles.errorText}>{errors.email}</Text> : null}
      </View>

      {mode === 'signup' ? (
        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <Text style={authUiStyles.fieldLabel}>Phone</Text>
            <Text style={authUiStyles.fieldHint}>Optional</Text>
          </View>
          <AppInput
            autoCapitalize="none"
            keyboardType="phone-pad"
            inputMode="tel"
            maxLength={15}
            onChangeText={(value) => onChange('phone', value.replace(/[^\d+]/g, ''))}
            placeholder="1234567890"
            error={Boolean(errors.phone)}
            value={values.phone}
          />
          {errors.phone ? <Text style={authUiStyles.errorText}>{errors.phone}</Text> : null}
        </View>
      ) : null}

      {serverError ? <AuthBanner text={serverError} tone="error" /> : null}

      <AppButton loading={isSubmitting} onPress={onSubmit}>
        {mode === 'login' ? 'Send login code' : 'Send secure code'}
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  authCard: {
    gap: 16,
  },
  authModeRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 6,
    borderRadius: disciplineTheme.radius.xl,
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e7edf7',
  },
  authModeButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authModeButtonActive: {
    borderColor: 'rgba(79, 70, 229, 0.18)',
    backgroundColor: disciplineTheme.colors.primary,
  },
  authModeText: {
    color: disciplineTheme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  authModeTextActive: {
    color: disciplineTheme.colors.primaryText,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
