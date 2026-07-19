import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { useDeleteDistractionMutation, useWorkspaceQuery } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, ScreenContainer, SectionHeader } from '@/shared/ui';

export function DistractionsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const query = useWorkspaceQuery(token);
  const remove = useDeleteDistractionMutation(token ?? '');

  if (query.isLoading) {
    return <ScreenContainer scroll={false}><View style={styles.loading}><ActivityIndicator color={disciplineTheme.colors.primary} /></View></ScreenContainer>;
  }

  const logs = query.data?.distractionLogs ?? [];
  const summary = query.data?.distractionSummary;

  function confirmDelete(id: string) {
    Alert.alert('Delete distraction log?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove.mutate(id) },
    ]);
  }

  return (
    <ScreenContainer contentStyle={styles.content} refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
      <AppCard style={styles.hero}>
        <SectionHeader eyebrow="Distractions" title="Notice the pattern without shame" subtitle="Capture what pulled you away, then choose a better replacement action." />
        <AppButton onPress={() => router.push('/distractions/form' as never)}>Log a distraction</AppButton>
      </AppCard>

      <View style={styles.metrics}>
        <Metric label="Recent logs" value={String(summary?.totalLogs ?? logs.length)} />
        <Metric label="Minutes lost" value={String(summary?.totalMinutesLost ?? 0)} />
        <Metric label="Top pull" value={summary?.topPlatform ?? 'None'} />
      </View>

      {summary?.latestReplacementAction ? <AppCard><Text style={styles.label}>Latest replacement</Text><Text style={styles.copy}>{summary.latestReplacementAction}</Text></AppCard> : null}

      <SectionHeader eyebrow="History" title="Recent distraction logs" />
      {logs.map((log) => (
        <AppCard key={log.id}>
          <View style={styles.row}><View style={styles.rowCopy}><Text style={styles.title}>{log.platform}</Text><Text style={styles.meta}>{log.minutesLost} minutes · {new Date(log.createdAt).toLocaleDateString()}</Text></View><Text style={styles.minutes}>-{log.minutesLost}m</Text></View>
          {log.triggerReason ? <Text style={styles.copy}>Trigger: {log.triggerReason}</Text> : null}
          {log.replacementAction ? <Text style={styles.copy}>Replace with: {log.replacementAction}</Text> : null}
          <View style={styles.actions}><AppButton variant="ghost" onPress={() => router.push({ pathname: '/distractions/form', params: { id: log.id } } as never)}>Edit</AppButton><AppButton variant="secondary" loading={remove.isPending} onPress={() => confirmDelete(log.id)}>Delete</AppButton></View>
        </AppCard>
      ))}
      {!logs.length ? <AppCard><Text style={styles.copy}>No distraction logs yet. Add one when you notice attention drifting.</Text></AppCard> : null}
    </ScreenContainer>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text numberOfLines={1} style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  content: { gap: disciplineTheme.spacing.lg }, loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }, hero: { gap: disciplineTheme.spacing.md }, metrics: { flexDirection: 'row', gap: disciplineTheme.spacing.sm }, metric: { flex: 1, padding: disciplineTheme.spacing.md, borderRadius: disciplineTheme.radius.lg, backgroundColor: disciplineTheme.colors.surface, borderWidth: 1, borderColor: disciplineTheme.colors.border, gap: 4 }, metricValue: { color: disciplineTheme.colors.text, fontSize: 20, fontWeight: '900' }, metricLabel: { color: disciplineTheme.colors.textFaint, fontSize: 11, fontWeight: '700' }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, rowCopy: { flex: 1, gap: 4 }, title: { color: disciplineTheme.colors.text, fontSize: 18, fontWeight: '800' }, meta: { color: disciplineTheme.colors.textFaint, fontSize: 12 }, minutes: { color: disciplineTheme.colors.danger, fontWeight: '800' }, label: { color: disciplineTheme.colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }, copy: { color: disciplineTheme.colors.textMuted, fontSize: 14, lineHeight: 22 }, actions: { flexDirection: 'row', gap: 10 } });
