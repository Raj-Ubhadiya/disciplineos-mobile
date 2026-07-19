import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { useCreateDistractionMutation, useUpdateDistractionMutation, useWorkspaceQuery } from '@/features/workspace/workspace-query';
import type { DistractionLog } from '@/lib/types';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, FormField, ScreenContainer, SectionHeader } from '@/shared/ui';

export function DistractionFormScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id?: string }>(); const { token } = useAuth(); const workspace = useWorkspaceQuery(token);
  const existing = workspace.data?.distractionLogs.find((log) => log.id === id);
  const [platform, setPlatform] = useState(''); const [minutes, setMinutes] = useState(''); const [trigger, setTrigger] = useState(''); const [before, setBefore] = useState(''); const [after, setAfter] = useState(''); const [replacement, setReplacement] = useState(''); const [error, setError] = useState<string | null>(null);
  const create = useCreateDistractionMutation(token ?? ''); const update = useUpdateDistractionMutation(token ?? '');

  useEffect(() => { if (existing) { setPlatform(existing.platform); setMinutes(String(existing.minutesLost)); setTrigger(existing.triggerReason ?? ''); setBefore(existing.moodBefore ?? ''); setAfter(existing.moodAfter ?? ''); setReplacement(existing.replacementAction ?? ''); } }, [existing]);

  function submit() {
    const parsedMinutes = Number(minutes);
    if (!platform.trim()) return setError('Platform or distraction source is required.');
    if (!Number.isInteger(parsedMinutes) || parsedMinutes < 1 || parsedMinutes > 1440) return setError('Minutes must be between 1 and 1440.');
    setError(null);
    const input = { platform: platform.trim(), minutesLost: parsedMinutes, ...(trigger.trim() ? { triggerReason: trigger.trim() } : {}), ...(before.trim() ? { moodBefore: before.trim() } : {}), ...(after.trim() ? { moodAfter: after.trim() } : {}), ...(replacement.trim() ? { replacementAction: replacement.trim() } : {}) };
    const done = { onSuccess: (_saved: unknown) => router.replace('/distractions' as never) };
    if (id) update.mutate({ id, input }, done); else create.mutate(input, done);
  }

  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow={id ? 'Edit log' : 'New log'} title="Turn a distraction into information" subtitle="Be specific enough to recognize the pattern next time." /><AppCard><FormField label="Platform or source" error={error}><AppInput value={platform} onChangeText={setPlatform} maxLength={80} placeholder="Instagram, YouTube, notifications…" /></FormField><FormField label="Minutes lost"><AppInput value={minutes} onChangeText={setMinutes} keyboardType="number-pad" /></FormField><FormField label="Trigger"><AppInput multiline value={trigger} onChangeText={setTrigger} maxLength={500} /></FormField><FormField label="Mood before"><AppInput value={before} onChangeText={setBefore} maxLength={80} /></FormField><FormField label="Mood after"><AppInput value={after} onChangeText={setAfter} maxLength={80} /></FormField><FormField label="Replacement action"><AppInput multiline value={replacement} onChangeText={setReplacement} maxLength={500} placeholder="Walk, breathe, restart for ten minutes…" /></FormField><AppButton loading={create.isPending || update.isPending} onPress={submit}>{id ? 'Save changes' : 'Save distraction log'}</AppButton></AppCard></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { gap: disciplineTheme.spacing.lg } });
