import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useProtectedWorkspace } from '@/features/workspace/hooks/use-protected-workspace';
import { disciplineTheme } from '@/shared/theme';
import { AppCard, ScreenContainer, SectionHeader } from '@/shared/ui';

export function AnalyticsScreen() {
  const { isLoading, workspace, workspaceQuery: { refetch, isRefetching } } = useProtectedWorkspace();
  if (isLoading) return <ScreenContainer scroll={false}><View style={styles.loading}><ActivityIndicator color={disciplineTheme.colors.primary} /></View></ScreenContainer>;
  const data = workspace?.analyticsSummary;
  if (!data) return <ScreenContainer><AppCard><Text style={styles.copy}>Analytics are temporarily unavailable. Pull to refresh after the backend wakes up.</Text></AppCard></ScreenContainer>;
  const metrics = [
    ['Active goals', data.activeGoals], ['Habits', data.totalHabits], ['Completions', data.habitCompletions], ['Total streak', data.totalStreak],
    ['Focus minutes', data.focusSessionMinutes], ['Clean sessions', data.distractionFreeFocusSessions], ['Minutes lost', data.distractionMinutesLost], ['Reflections', data.dailyReflections],
  ] as const;
  return <ScreenContainer contentStyle={styles.content} refreshing={isRefetching} onRefresh={() => void refetch()}><AppCard style={styles.hero}><Text style={styles.eyebrow}>Discipline score</Text><Text style={styles.score}>{data.focusScore}</Text><Text style={styles.copy}>A practical signal built from focus, habits, reflection, accountability, and distraction patterns.</Text><View style={styles.track}><View style={[styles.fill, { width: `${data.focusScore}%` }]} /></View></AppCard><SectionHeader eyebrow="Momentum" title="Your operating metrics" subtitle="Use these numbers to choose the next adjustment, not to judge the day." /><View style={styles.grid}>{metrics.map(([label, value]) => <View key={label} style={styles.metric}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>)}</View><AppCard><SectionHeader eyebrow="Attention" title={data.topDistractionPlatform ?? 'No top distraction yet'} subtitle={`${data.distractionMinutesLost} recent minutes lost · ${data.averageReflectionScore} average reflection score`} /></AppCard></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { gap: disciplineTheme.spacing.lg }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }, hero: { gap: disciplineTheme.spacing.md }, eyebrow: { color: disciplineTheme.colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }, score: { color: disciplineTheme.colors.text, fontSize: 64, lineHeight: 68, fontWeight: '900' }, copy: { color: disciplineTheme.colors.textMuted, fontSize: 15, lineHeight: 23 }, track: { height: 10, borderRadius: 999, backgroundColor: disciplineTheme.colors.primarySoft, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 999, backgroundColor: disciplineTheme.colors.primary }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, metric: { width: '48%', padding: disciplineTheme.spacing.md, borderRadius: disciplineTheme.radius.lg, backgroundColor: disciplineTheme.colors.surface, borderWidth: 1, borderColor: disciplineTheme.colors.border, gap: 4 }, value: { color: disciplineTheme.colors.text, fontSize: 26, fontWeight: '900' }, label: { color: disciplineTheme.colors.textMuted, fontSize: 12, fontWeight: '700' } });
