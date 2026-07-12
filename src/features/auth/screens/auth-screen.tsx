import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthForm } from '@/features/auth/components/auth-form';
import { AuthBanner } from '@/features/auth/components/auth-ui';
import { useAuth } from '@/features/auth/auth-provider';
import {
  type AuthFieldErrors,
  type AuthFormValues,
  type AuthMode,
  validateAuthForm,
} from '@/features/auth/auth-validation';
import { disciplineTheme } from '@/shared/theme';
import { readLastWorkspaceRoute } from '@/shared/preferences/navigation-preferences';
import { AppCard, ScreenContainer } from '@/shared/ui';

const initialFormValues: AuthFormValues = {
  name: '',
  email: '',
  phone: '',
  code: '',
};

function getFriendlyAuthNotice(mode: AuthMode, message: string | null) {
  if (!message) {
    return null;
  }

  const normalized = message.toLowerCase();

  if (mode === 'signup' && normalized.includes('already registered')) {
    return {
      title: 'This email is already registered.',
      detail: 'Use the login flow to receive your OTP code for this account.',
      suggestMode: 'login' as const,
    };
  }

  if (mode === 'login' && (normalized.includes('not found') || normalized.includes('not registered'))) {
    return {
      title: 'No account was found for this email.',
      detail: 'Use sign up first, then request your secure code again.',
      suggestMode: 'signup' as const,
    };
  }

  return {
    title: message,
    detail: 'Check the backend response and try again.',
    suggestMode: null,
  };
}

function isAuthMode(value: string | string[] | undefined): value is AuthMode {
  return value === 'login' || value === 'signup';
}

export function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const requestedMode = isAuthMode(params.mode) ? params.mode : 'signup';
  const { clearError, error, isAuthenticating, isBooting, requestOtpCode, user } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>(requestedMode);
  const [values, setValues] = useState<AuthFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [localNotice, setLocalNotice] = useState<string | null>(null);
  const friendlyNotice = getFriendlyAuthNotice(authMode, error ?? localNotice);

  useEffect(() => {
    setAuthMode(requestedMode);
    setFieldErrors({});
    setLocalNotice(null);
    clearError();
  }, [requestedMode]);

  useEffect(() => {
    async function redirectSignedInUser() {
      if (!isBooting && user) {
        router.replace(await readLastWorkspaceRoute());
      }
    }

    void redirectSignedInUser();
  }, [isBooting, router, user]);

  const heading = useMemo(
    () =>
      authMode === 'login'
        ? {
            eyebrow: 'Welcome back',
            title: 'Sign in',
            copy: 'Use email to continue to your DisciplineOS workspace.',
          }
        : {
            eyebrow: 'Create account',
            title: 'Create your account.',
            copy: 'Add your details once, then start using your workspace on mobile.',
          },
    [authMode],
  );

  function updateField(field: keyof AuthFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleModeChange(mode: AuthMode) {
    clearError();
    setAuthMode(mode);
    setFieldErrors({});
    router.replace({
      pathname: '/auth',
      params: { mode },
    });
  }

  async function handleSubmit() {
    clearError();
    setLocalNotice(null);

    const nextErrors = validateAuthForm(authMode, values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await requestOtpCode({
        channel: 'email',
        purpose: authMode,
        email: values.email,
        ...(authMode === 'signup' ? { phone: values.phone, name: values.name } : {}),
      });

      router.push('/verify-otp');
    } catch (requestError) {
      setLocalNotice(
        requestError instanceof Error ? requestError.message : 'Unable to send the verification code.',
      );
    }
  }

  return (
    <LinearGradient
      colors={['#ecebff', '#f7f9fe', '#e1f0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <ScreenContainer contentStyle={styles.content}>
        <AppCard style={styles.authShell}>
          <View style={styles.brandRow}>
            <Text style={styles.brandMark}>DisciplineOS AI</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.brandMeta}>Email OTP</Text>
          </View>

          <Text style={styles.eyebrow}>{heading.eyebrow}</Text>
          <Text style={styles.title}>{heading.title}</Text>
          <Text style={styles.copy}>{heading.copy}</Text>

          <View style={styles.formShell}>
            {error ? <AuthBanner text={friendlyNotice?.title ?? error} tone="error" /> : null}
            {localNotice && !error ? (
              <AuthBanner text={friendlyNotice?.title ?? localNotice} tone="error" />
            ) : null}
            {friendlyNotice?.detail ? (
              <Text style={styles.noticeCopy}>{friendlyNotice.detail}</Text>
            ) : null}

            <AuthForm
              mode={authMode}
              values={values}
              errors={fieldErrors}
              isSubmitting={isAuthenticating}
              serverError={null}
              onModeChange={handleModeChange}
              onChange={updateField}
              onSubmit={() => void handleSubmit()}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.switchCopy}>
              {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
            </Text>
            <Pressable onPress={() => handleModeChange(authMode === 'login' ? 'signup' : 'login')}>
              <Text style={styles.switchLink}>
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.replace('/')} style={styles.backLinkWrap}>
            <Text style={styles.backLink}>Back to home</Text>
          </Pressable>
        </AppCard>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: disciplineTheme.spacing.xl,
  },
  authShell: {
    gap: disciplineTheme.spacing.lg,
    paddingTop: disciplineTheme.spacing.xl,
    paddingBottom: disciplineTheme.spacing.xl,
    borderColor: 'rgba(219, 227, 239, 0.9)',
    shadowOpacity: 0.08,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    color: disciplineTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  brandDivider: {
    width: 22,
    height: 1,
    backgroundColor: disciplineTheme.colors.borderStrong,
  },
  brandMeta: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: disciplineTheme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3.2,
  },
  title: {
    color: disciplineTheme.colors.text,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 38,
    letterSpacing: -1.4,
  },
  copy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 16,
    lineHeight: 27,
    maxWidth: 320,
  },
  formShell: {
    gap: disciplineTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#edf1f8',
    paddingTop: disciplineTheme.spacing.lg,
  },
  noticeCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
    paddingTop: disciplineTheme.spacing.sm,
  },
  switchCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
  },
  switchLink: {
    color: disciplineTheme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  backLinkWrap: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backLink: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
