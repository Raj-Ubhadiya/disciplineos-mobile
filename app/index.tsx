import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { fetchHealth } from '@/lib/api';
import { disciplineTheme } from '@/shared/theme';
import { readLastWorkspaceRoute } from '@/shared/preferences/navigation-preferences';
import { AppButton, AppCard, ScreenContainer, SectionHeader } from '@/shared/ui';

const landingSteps = [
  'Choose one meaningful direction',
  'See today without the clutter',
  'Protect one focused block',
  'Close the day with a short reflection',
] as const;

const valueCards = [
  {
    title: 'Direction first',
    copy: 'Keep one visible goal at the center so the day has shape.',
    color: disciplineTheme.colors.primary,
  },
  {
    title: 'Today made clear',
    copy: 'Reduce the day into habits, focus, reminders, and one next move.',
    color: disciplineTheme.colors.brandTertiary,
  },
  {
    title: 'Momentum that repeats',
    copy: 'Finish, reflect, and make tomorrow easier to start.',
    color: disciplineTheme.colors.warning,
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { isBooting, signOut, user } = useAuth();
  const [healthState, setHealthState] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      const result = await fetchHealth();

      if (isMounted) {
        setHealthState(result?.status === 'ok' ? 'online' : 'offline');
      }
    }

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  const healthLabel =
    healthState === 'checking'
      ? 'Checking API'
      : healthState === 'online'
        ? 'Backend reachable'
        : 'Backend unavailable';

  async function handleSignOut() {
    await signOut();
  }

  async function openRememberedWorkspace() {
    router.replace(await readLastWorkspaceRoute());
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppCard style={styles.heroCard}>
        <View style={styles.topRail}>
          <Text style={styles.brand}>DisciplineOS AI</Text>
          <View
            style={[
              styles.statusPill,
              healthState === 'online' ? styles.statusOnline : styles.statusOffline,
            ]}
          >
            <Text style={styles.statusText}>{healthLabel}</Text>
          </View>
        </View>

        <View style={styles.kickerRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Daily discipline system</Text>
          </View>
          <Text style={styles.brandSubline}>Mobile-first extension of your real workspace</Text>
        </View>

        <Text style={styles.heroTitle}>Turn intention into visible progress.</Text>
        <Text style={styles.heroCopy}>
          DisciplineOS AI helps you choose what matters, act on it today, and build a calmer,
          repeatable rhythm around focus.
        </Text>

        <View style={styles.heroActionRow}>
          {user ? (
            <AppButton onPress={() => void openRememberedWorkspace()}>
              Open your workspace
            </AppButton>
          ) : (
            <AppButton
              onPress={() =>
                router.push({
                  pathname: '/auth',
                  params: { mode: 'signup' },
                })
              }
            >
              Start building discipline
            </AppButton>
          )}
          <AppButton variant="secondary" onPress={() => router.push('/dashboard')}>
            Preview workspace
          </AppButton>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroMetaLabel}>Core loop</Text>
            <Text style={styles.heroMetaValue}>Goal -&gt; Today -&gt; Focus -&gt; Reflection</Text>
          </View>
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroMetaLabel}>Built for</Text>
            <Text style={styles.heroMetaValue}>
              Students, founders, creators, professionals
            </Text>
          </View>
        </View>
      </AppCard>

      <LinearGradient
        colors={['#111a3a', '#243a72', '#3f62b3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flowPanel}
      >
        <Text style={styles.flowEyebrow}>Daily flow</Text>
        <Text style={styles.flowTitle}>A clear next step beats a crowded system.</Text>
        <Text style={styles.flowCopy}>
          Open the app, see what matters now, complete the next action, then return tomorrow with
          more clarity.
        </Text>

        {landingSteps.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.flowStepCard}>
            <View style={styles.flowStepIndex}>
              <Text style={styles.flowStepIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.flowStepCopy}>
              <Text style={styles.flowStepLabel}>Step {index + 1}</Text>
              <Text style={styles.flowStepTitle}>{step}</Text>
            </View>
          </View>
        ))}
      </LinearGradient>

      <SectionHeader
        eyebrow="Why It Works"
        title="A smaller interface with a stronger point of view"
        subtitle="The mobile app should reduce choice overload, not recreate desktop density."
      />

      <View style={styles.valueGrid}>
        {valueCards.map((item) => (
          <AppCard key={item.title} style={styles.valueCard}>
            <View style={[styles.valueAccent, { backgroundColor: item.color }]} />
            <View style={[styles.valueDot, { backgroundColor: `${item.color}18` }]}>
              <View style={[styles.valueDotInner, { backgroundColor: item.color }]} />
            </View>
            <Text style={styles.valueTitle}>{item.title}</Text>
            <Text style={styles.valueCopy}>{item.copy}</Text>
          </AppCard>
        ))}
      </View>

      {isBooting ? (
        <AppCard>
          <View style={styles.bootState}>
            <ActivityIndicator color={disciplineTheme.colors.primary} />
            <Text style={styles.bootTitle}>Checking saved session...</Text>
            <Text style={styles.bootCopy}>
              If you already signed in before, we&apos;ll take you back to your workspace.
            </Text>
          </View>
        </AppCard>
      ) : user ? (
        <AppCard>
          <SectionHeader
            eyebrow="Session"
            title={`Signed in as ${user.name ?? user.email}`}
            subtitle="Your real backend account is connected and ready to continue."
          />
          <View style={styles.authActionStack}>
            <AppButton onPress={() => void openRememberedWorkspace()}>
              Open today&apos;s workspace
            </AppButton>
            <AppButton variant="secondary" onPress={() => void handleSignOut()}>
              Sign out
            </AppButton>
          </View>
        </AppCard>
      ) : (
        <AppCard>
          <SectionHeader
            eyebrow="Account"
            title="Start with one secure email flow"
            subtitle="Use the same focused auth screen for both sign up and login."
          />
          <View style={styles.authActionStack}>
            <AppButton
              onPress={() =>
                router.push({
                  pathname: '/auth',
                  params: { mode: 'signup' },
                })
              }
            >
              Create account
            </AppButton>
            <AppButton
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: '/auth',
                  params: { mode: 'login' },
                })
              }
            >
              Log in
            </AppButton>
          </View>
        </AppCard>
      )}

      <AppCard>
        <SectionHeader
          eyebrow="What You Get"
          title="The same backend, shaped for mobile"
          subtitle="This app keeps the same product language and data model as the web workspace."
        />
        <View style={styles.featureStack}>
          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>Shared auth and profile</Text>
            <Text style={styles.featureCopy}>
              Use the same account, OTP flow, and user settings across web and mobile.
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>Daily action loop</Text>
            <Text style={styles.featureCopy}>
              Goals, habits, focus, reminders, and reflections stay connected instead of living in
              separate tools.
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>Touch-first workflows</Text>
            <Text style={styles.featureCopy}>
              The app is designed for fast check-ins and next actions, not dense desktop tables.
            </Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.bottomNote}>
        <Text style={styles.bottomNoteText}>DisciplineOS AI</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: disciplineTheme.spacing.xl,
  },
  topRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: disciplineTheme.spacing.md,
  },
  brand: {
    color: disciplineTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  brandSubline: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  statusPill: {
    borderRadius: disciplineTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusOnline: {
    backgroundColor: disciplineTheme.colors.successSoft,
  },
  statusOffline: {
    backgroundColor: disciplineTheme.colors.warningSoft,
  },
  statusText: {
    color: disciplineTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    paddingTop: 18,
  },
  kickerRow: {
    gap: disciplineTheme.spacing.sm,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: disciplineTheme.radius.pill,
    backgroundColor: disciplineTheme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  heroBadgeText: {
    color: disciplineTheme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -1.8,
  },
  heroCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 17,
    lineHeight: 29,
  },
  heroActionRow: {
    gap: disciplineTheme.spacing.sm,
  },
  heroMetaRow: {
    gap: disciplineTheme.spacing.sm,
  },
  heroMetaCard: {
    borderRadius: disciplineTheme.radius.lg,
    borderWidth: 1,
    borderColor: '#edf1f8',
    backgroundColor: '#fbfcff',
    padding: disciplineTheme.spacing.md,
    gap: 4,
  },
  heroMetaLabel: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroMetaValue: {
    color: disciplineTheme.colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  flowPanel: {
    borderRadius: 28,
    padding: disciplineTheme.spacing.xl,
    gap: disciplineTheme.spacing.md,
    shadowColor: '#1f3a74',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 36,
    elevation: 7,
  },
  flowEyebrow: {
    color: '#dbe4ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  flowTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -1.2,
  },
  flowCopy: {
    color: '#dfe7ff',
    fontSize: 16,
    lineHeight: 27,
  },
  flowStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: disciplineTheme.spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
  },
  flowStepIndex: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepIndexText: {
    color: disciplineTheme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  flowStepCopy: {
    flex: 1,
    gap: 4,
  },
  flowStepLabel: {
    color: '#dbe4ff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  flowStepTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  valueGrid: {
    gap: disciplineTheme.spacing.md,
  },
  valueCard: {
    minHeight: 148,
    overflow: 'hidden',
  },
  valueAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  valueDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  valueTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  valueCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 25,
  },
  bootState: {
    alignItems: 'flex-start',
    gap: 8,
  },
  bootTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  bootCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 24,
  },
  authActionStack: {
    gap: disciplineTheme.spacing.sm,
  },
  featureStack: {
    gap: disciplineTheme.spacing.sm,
  },
  featureRow: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: disciplineTheme.colors.border,
    backgroundColor: disciplineTheme.colors.surface,
    padding: 20,
    gap: 10,
  },
  featureTitle: {
    color: disciplineTheme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
  },
  featureCopy: {
    color: disciplineTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 26,
  },
  bottomNote: {
    alignItems: 'center',
    paddingBottom: disciplineTheme.spacing.xl,
  },
  bottomNoteText: {
    color: disciplineTheme.colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
