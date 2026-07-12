import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthBanner, authUiStyles } from '@/features/auth/components/auth-ui';
import { useAuth } from '@/features/auth/auth-provider';
import { validateOtpCode } from '@/features/auth/auth-validation';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, DevErrorPanel, ScreenContainer } from '@/shared/ui';

export function VerifyOtpScreen() {
  const router = useRouter();
  const {
    clearError,
    clearPendingOtpSession,
    error,
    isAuthenticating,
    pendingOtpSession,
    resendOtpCode,
    verifyOtpCode,
  } = useAuth();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const verificationPurpose = pendingOtpSession?.purpose ?? 'login';

  useEffect(() => {
    if (!pendingOtpSession) {
      router.replace({
        pathname: '/auth',
        params: { mode: 'login' },
      });
    }
  }, [pendingOtpSession, router]);

  if (!pendingOtpSession) {
    return null;
  }

  async function handleVerify() {
    clearError();
    setNotice(null);

    const nextCodeError = validateOtpCode(code);
    setCodeError(nextCodeError);

    if (nextCodeError) {
      return;
    }

    try {
      await verifyOtpCode({ code });
      router.replace('/workspace');
    } catch (verifyError) {
      setNotice(
        verifyError instanceof Error
          ? verifyError.message
          : 'Unable to verify the code. Please try again.',
      );
    }
  }

  async function handleResend() {
    clearError();
    setNotice(null);

    try {
      await resendOtpCode();
      setNotice('A fresh verification code was sent.');
    } catch (resendError) {
      setNotice(
        resendError instanceof Error ? resendError.message : 'Unable to resend the code.',
      );
    }
  }

  function handleChangeDetails() {
    clearPendingOtpSession();
    clearError();
    router.replace({
      pathname: '/auth',
      params: { mode: verificationPurpose },
    });
  }

  return (
    <LinearGradient
      colors={['#ecebff', '#f7f9fe', '#e1f0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <ScreenContainer contentStyle={styles.content}>
        <AppCard style={styles.card}>
          <View style={styles.topAccent} />
          <Text style={styles.eyebrow}>OTP verification</Text>
          <Text style={styles.title}>Enter your 6-digit code</Text>
          <Text style={styles.copy}>
            We sent a secure code to {pendingOtpSession.email}. Verify it to enter your DisciplineOS workspace.
          </Text>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              {pendingOtpSession.purpose === 'signup' ? 'Creating account' : 'Signing in'}
            </Text>
            <Text style={styles.summaryValue}>{pendingOtpSession.email}</Text>
            {pendingOtpSession.phone ? (
              <Text style={styles.summaryHint}>Phone on file: {pendingOtpSession.phone}</Text>
            ) : null}
          </AppCard>

          {error ? <AuthBanner text={error} tone="error" /> : null}
          {notice ? <AuthBanner text={notice} tone="info" /> : null}

          <View style={styles.fieldBlock}>
            <Text style={authUiStyles.fieldLabel}>Verification code</Text>
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(value) => {
                setCode(value.replace(/[^0-9]/g, ''));
                if (codeError) {
                  setCodeError(null);
                }
              }}
              placeholder="123456"
              value={code}
              error={Boolean(codeError)}
            />
            {codeError ? <Text style={authUiStyles.errorText}>{codeError}</Text> : null}
          </View>

          <View style={styles.actions}>
            <AppButton loading={isAuthenticating} onPress={() => void handleVerify()}>
              Verify code
            </AppButton>
            <AppButton variant="secondary" onPress={() => void handleResend()} disabled={isAuthenticating}>
              Resend code
            </AppButton>
            <AppButton variant="ghost" onPress={handleChangeDetails} disabled={isAuthenticating}>
              Change details
            </AppButton>
          </View>

          <DevErrorPanel
            title="OTP debug"
            error={error ?? notice}
            hint="If verification fails, this screen shows the last frontend/API message without opening the terminal."
          />
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
    paddingBottom: disciplineTheme.spacing.xxl,
  },
  card: {
    overflow: 'hidden',
    gap: disciplineTheme.spacing.lg,
    paddingTop: disciplineTheme.spacing.xl,
  },
  topAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    backgroundColor: disciplineTheme.colors.primary,
  },
  eyebrow: {
    color: disciplineTheme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    color: disciplineTheme.colors.text,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  copy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 16,
    lineHeight: 28,
  },
  summaryCard: {
    backgroundColor: '#fcfdff',
    gap: 6,
  },
  summaryLabel: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: disciplineTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  summaryHint: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  fieldBlock: {
    gap: 6,
  },
  actions: {
    gap: disciplineTheme.spacing.sm,
  },
});
