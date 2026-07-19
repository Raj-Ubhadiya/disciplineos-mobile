import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAuth } from '@/features/auth/auth-provider';
import { useCreateRelationshipMutation, useWorkspaceQuery } from '@/features/workspace/workspace-query';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, FormField, ScreenContainer, SectionHeader } from '@/shared/ui';

export function AccountabilityScreen() {
  const router = useRouter(); const { token } = useAuth(); const query = useWorkspaceQuery(token); const create = useCreateRelationshipMutation(token ?? ''); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [error, setError] = useState<string | null>(null);
  function submit() { if (!name.trim() && !email.trim()) return setError('Add a partner name or email.'); setError(null); create.mutate({ ...(name.trim() ? { partnerName: name.trim() } : {}), ...(email.trim() ? { partnerEmail: email.trim() } : {}) }, { onSuccess: () => { setName(''); setEmail(''); } }); }
  return <ScreenContainer contentStyle={styles.content} refreshing={query.isRefetching} onRefresh={() => void query.refetch()}><SectionHeader eyebrow="Accountability" title="Support without surveillance" subtitle="Add a trusted partner and make clear, respectful commitments." /><AppCard><FormField label="Partner name" error={error}><AppInput value={name} onChangeText={setName} maxLength={120} /></FormField><FormField label="Partner email"><AppInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></FormField><AppButton loading={create.isPending} onPress={submit}>Add accountability partner</AppButton></AppCard><SectionHeader eyebrow="Partners" title="Your support circle" />{(query.data?.relationships ?? []).map((relationship) => <AppCard key={relationship.id}><Text style={styles.title}>{relationship.partner?.name ?? relationship.partnerName ?? 'Accountability partner'}</Text><Text style={styles.copy}>{relationship.partner?.email ?? relationship.status}</Text><AppButton variant="ghost" onPress={() => router.push({ pathname: '/accountability/[id]', params: { id: relationship.id } } as never)}>Open check-ins</AppButton></AppCard>)}{!query.data?.relationships.length ? <AppCard><Text style={styles.copy}>No accountability partners yet.</Text></AppCard> : null}</ScreenContainer>;
}
const styles = StyleSheet.create({ content: { gap: disciplineTheme.spacing.lg }, title: { color: disciplineTheme.colors.text, fontSize: 18, fontWeight: '800' }, copy: { color: disciplineTheme.colors.textMuted, fontSize: 14 } });
