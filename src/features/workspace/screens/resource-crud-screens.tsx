import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import {
  useCreateGoalMutation, useCreateHabitMutation, useDeleteGoalMutation, useDeleteHabitMutation,
  useDeleteReminderMutation, useGoalQuery, useHabitQuery, useUpdateGoalMutation,
  useUpdateHabitMutation, useUpdateReminderMutation, useWorkspaceQuery,
} from '@/features/workspace/workspace-query';
import type { CreateReminderInput, Goal, Habit, Reminder } from '@/lib/types';
import { disciplineTheme } from '@/shared/theme';
import { AppButton, AppCard, AppInput, FormField, ScreenContainer, SectionHeader } from '@/shared/ui';

const categories = ['personal', 'health', 'career', 'study', 'business', 'finance', 'relationship'];
const reminderTypes: CreateReminderInput['type'][] = ['habit', 'goal', 'accountability', 'distraction_replacement'];

function Loading() {
  return <ScreenContainer scroll={false}><View style={styles.loading}><ActivityIndicator color={disciplineTheme.colors.primary} /></View></ScreenContainer>;
}

function Chips({ items, selected, onSelect }: { items: string[]; selected?: string | null; onSelect: (value: string) => void }) {
  return <View style={styles.chips}>{items.map((item) => <AppButton key={item} variant={selected === item ? 'primary' : 'ghost'} onPress={() => onSelect(item)} style={styles.chip}>{item.replace(/_/g, ' ')}</AppButton>)}</View>;
}

function DangerButton({ label, pending, onConfirm }: { label: string; pending: boolean; onConfirm: () => void }) {
  return <AppButton variant="secondary" loading={pending} onPress={() => Alert.alert(label, 'This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: label, style: 'destructive', onPress: onConfirm }])}>{label}</AppButton>;
}

export function GoalsScreen() {
  const router = useRouter(); const { token } = useAuth(); const query = useWorkspaceQuery(token);
  if (query.isLoading) return <Loading />;
  const goals = query.data?.goals ?? [];
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Goals" title="Meaningful outcomes" subtitle="Create, review, and adjust the outcomes behind your daily actions." /><AppButton onPress={() => router.push('/goals/form' as never)}>Create goal</AppButton>{goals.map((goal) => <AppCard key={goal.id}><Text style={styles.title}>{goal.title}</Text><Text style={styles.meta}>{goal.category} · Priority {goal.priority ?? 3} · {goal.status ?? 'active'}</Text><Text style={styles.copy}>{goal.whyItMatters || goal.description || 'No supporting note yet.'}</Text><AppButton variant="ghost" onPress={() => router.push({ pathname: '/goals/[id]', params: { id: goal.id } } as never)}>View goal</AppButton></AppCard>)}{!goals.length ? <AppCard><Text style={styles.copy}>No goals yet. Create the first outcome you want your habits to support.</Text></AppCard> : null}</ScreenContainer>;
}

export function GoalDetailScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id: string }>(); const { token } = useAuth(); const query = useGoalQuery(token, id); const remove = useDeleteGoalMutation(token ?? '');
  if (query.isLoading) return <Loading />; const goal = query.data; if (!goal) return null;
  const doDelete = () => remove.mutate(goal.id, { onSuccess: () => router.replace('/goals' as never) });
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Goal details" title={goal.title} subtitle={`${goal.category} · ${goal.status ?? 'active'}`} /><AppCard><Text style={styles.label}>Why it matters</Text><Text style={styles.copy}>{goal.whyItMatters || 'Not provided'}</Text><Text style={styles.label}>Description</Text><Text style={styles.copy}>{goal.description || 'Not provided'}</Text><Text style={styles.label}>Priority</Text><Text style={styles.copy}>{goal.priority ?? 3} / 5</Text>{goal.targetDate ? <Text style={styles.copy}>Target: {new Date(goal.targetDate).toLocaleDateString()}</Text> : null}</AppCard><AppButton onPress={() => router.push({ pathname: '/goals/form', params: { id: goal.id } } as never)}>Edit goal</AppButton><DangerButton label="Delete goal" pending={remove.isPending} onConfirm={doDelete} /></ScreenContainer>;
}

export function GoalFormScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id?: string }>(); const { token } = useAuth(); const detail = useGoalQuery(token, id ?? '');
  const [title, setTitle] = useState(''); const [category, setCategory] = useState('personal'); const [description, setDescription] = useState(''); const [why, setWhy] = useState(''); const [priority, setPriority] = useState('3'); const [status, setStatus] = useState('active'); const [error, setError] = useState<string | null>(null);
  useEffect(() => { const g = detail.data; if (g) { setTitle(g.title); setCategory(g.category); setDescription(g.description ?? ''); setWhy(g.whyItMatters ?? ''); setPriority(String(g.priority ?? 3)); setStatus(g.status ?? 'active'); } }, [detail.data]);
  const create = useCreateGoalMutation(token ?? ''); const update = useUpdateGoalMutation(token ?? ''); const pending = create.isPending || update.isPending;
  const submit = () => { if (!title.trim()) return setError('Goal title is required.'); const input = { title: title.trim(), category, description: description.trim(), whyItMatters: why.trim(), priority: Number(priority), ...(id ? { status } : {}) }; const done = { onSuccess: (goal: unknown) => router.replace({ pathname: '/goals/[id]', params: { id: (goal as Goal).id } } as never) }; if (id) update.mutate({ id, input }, done); else create.mutate(input, done); };
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow={id ? 'Edit goal' : 'New goal'} title={id ? 'Adjust the outcome' : 'Define an outcome'} /><AppCard><FormField label="Title" error={error}><AppInput value={title} onChangeText={setTitle} maxLength={160} /></FormField><FormField label="Category"><Chips items={categories} selected={category} onSelect={setCategory} /></FormField><FormField label="Description"><AppInput multiline value={description} onChangeText={setDescription} maxLength={1000} /></FormField><FormField label="Why it matters"><AppInput multiline value={why} onChangeText={setWhy} maxLength={1000} /></FormField><FormField label="Priority (1–5)"><AppInput keyboardType="number-pad" value={priority} onChangeText={setPriority} /></FormField>{id ? <FormField label="Status"><Chips items={['active', 'completed', 'paused']} selected={status} onSelect={setStatus} /></FormField> : null}<AppButton loading={pending} onPress={submit}>{id ? 'Save changes' : 'Create goal'}</AppButton></AppCard></ScreenContainer>;
}

export function HabitDetailScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id: string }>(); const { token } = useAuth(); const query = useHabitQuery(token, id); const remove = useDeleteHabitMutation(token ?? '');
  if (query.isLoading) return <Loading />; const habit = query.data; if (!habit) return null;
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Habit details" title={habit.title} subtitle={`${habit.frequency ?? 'daily'} · ${habit.currentStreak} day streak`} /><AppCard><Text style={styles.label}>Reminder time</Text><Text style={styles.copy}>{habit.reminderTime || 'Not set'}</Text><Text style={styles.label}>Linked goal</Text><Text style={styles.copy}>{habit.goalId || 'No linked goal'}</Text></AppCard><AppButton onPress={() => router.push({ pathname: '/habits/form', params: { id: habit.id } } as never)}>Edit habit</AppButton><DangerButton label="Delete habit" pending={remove.isPending} onConfirm={() => remove.mutate(habit.id, { onSuccess: () => router.replace('/habits' as never) })} /></ScreenContainer>;
}

export function HabitFormScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id?: string }>(); const { token } = useAuth(); const workspace = useWorkspaceQuery(token); const detail = useHabitQuery(token, id ?? '');
  const [title, setTitle] = useState(''); const [frequency, setFrequency] = useState('daily'); const [reminderTime, setReminderTime] = useState(''); const [goalId, setGoalId] = useState<string | null>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => { const h = detail.data; if (h) { setTitle(h.title); setFrequency(h.frequency ?? 'daily'); setReminderTime(h.reminderTime ?? ''); setGoalId(h.goalId ?? null); } }, [detail.data]);
  const create = useCreateHabitMutation(token ?? ''); const update = useUpdateHabitMutation(token ?? ''); const submit = () => { if (!title.trim()) return setError('Habit title is required.'); const input = { title: title.trim(), frequency, reminderTime: reminderTime.trim() || null, goalId }; const done = { onSuccess: (habit: unknown) => router.replace({ pathname: '/habits/[id]', params: { id: (habit as Habit).id } } as never) }; if (id) update.mutate({ id, input }, done); else create.mutate({ title: input.title, frequency, ...(goalId ? { goalId } : {}), ...(reminderTime.trim() ? { reminderTime: reminderTime.trim() } : {}) }, done); };
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow={id ? 'Edit habit' : 'New habit'} title="Build a repeatable action" /><AppCard><FormField label="Title" error={error}><AppInput value={title} onChangeText={setTitle} maxLength={160} /></FormField><FormField label="Frequency"><Chips items={['daily', 'weekdays', 'weekly']} selected={frequency} onSelect={setFrequency} /></FormField><FormField label="Reminder time" hint="Example: 07:30"><AppInput value={reminderTime} onChangeText={setReminderTime} maxLength={20} /></FormField><FormField label="Linked goal"><Chips items={['None', ...(workspace.data?.goals.map((g) => g.title) ?? [])]} selected={goalId ? (workspace.data?.goals.find((g) => g.id === goalId)?.title ?? null) : 'None'} onSelect={(name) => setGoalId(workspace.data?.goals.find((g) => g.title === name)?.id ?? null)} /></FormField><AppButton loading={create.isPending || update.isPending} onPress={submit}>{id ? 'Save changes' : 'Create habit'}</AppButton></AppCard></ScreenContainer>;
}

export function FocusDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { token } = useAuth(); const query = useWorkspaceQuery(token); if (query.isLoading) return <Loading />; const session = query.data?.focusSessions.find((s) => s.id === id); if (!session) return <ScreenContainer><Text style={styles.copy}>Focus session not found.</Text></ScreenContainer>;
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Focus session" title={session.title} subtitle={`${session.durationMinutes} minutes`} /><AppCard><Text style={styles.label}>Quality</Text><Text style={styles.copy}>{session.distractionFree ? 'Distraction-free' : 'Interrupted'}</Text><Text style={styles.label}>Energy</Text><Text style={styles.copy}>{session.energyLevel || 'Not recorded'}</Text><Text style={styles.label}>Note</Text><Text style={styles.copy}>{session.note || 'No note'}</Text><Text style={styles.meta}>{new Date(session.startedAt ?? session.createdAt ?? '').toLocaleString()}</Text></AppCard><Text style={styles.meta}>Editing and deleting require backend API support that is not currently available.</Text></ScreenContainer>;
}

export function ReminderDetailScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id: string }>(); const { token } = useAuth(); const query = useWorkspaceQuery(token); const remove = useDeleteReminderMutation(token ?? ''); if (query.isLoading) return <Loading />; const reminder = query.data?.reminders.find((r) => r.id === id); if (!reminder) return null;
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Reminder" title={reminder.title} subtitle={reminder.status} /><AppCard><Text style={styles.copy}>{new Date(reminder.scheduledAt).toLocaleString()}</Text><Text style={styles.copy}>{reminder.type.replace(/_/g, ' ')}</Text><Text style={styles.copy}>{reminder.note || 'No note'}</Text></AppCard><AppButton onPress={() => router.push({ pathname: '/reminders/form', params: { id } } as never)}>Edit reminder</AppButton><DangerButton label="Delete reminder" pending={remove.isPending} onConfirm={() => remove.mutate(id, { onSuccess: () => router.replace('/reminders' as never) })} /></ScreenContainer>;
}

export function ReminderEditScreen() {
  const router = useRouter(); const { id } = useLocalSearchParams<{ id: string }>(); const { token } = useAuth(); const query = useWorkspaceQuery(token); const update = useUpdateReminderMutation(token ?? ''); const reminder = query.data?.reminders.find((r) => r.id === id);
  const [title, setTitle] = useState(''); const [type, setType] = useState<CreateReminderInput['type']>('goal'); const [scheduledAt, setScheduledAt] = useState(''); const [note, setNote] = useState(''); const [status, setStatus] = useState<'pending' | 'completed' | 'skipped'>('pending');
  useEffect(() => { if (reminder) { setTitle(reminder.title); setType(reminder.type as CreateReminderInput['type']); setScheduledAt(reminder.scheduledAt); setNote(reminder.note ?? ''); setStatus(reminder.status as typeof status); } }, [reminder]);
  if (query.isLoading) return <Loading />; if (!reminder) return null; const submit = () => update.mutate({ id, input: { title: title.trim(), type, scheduledAt: new Date(scheduledAt).toISOString(), note: note.trim(), status } }, { onSuccess: (saved) => router.replace({ pathname: '/reminders/[id]', params: { id: (saved as Reminder).id } } as never) });
  return <ScreenContainer contentStyle={styles.content}><SectionHeader eyebrow="Edit reminder" title="Adjust the nudge" /><AppCard><FormField label="Title"><AppInput value={title} onChangeText={setTitle} /></FormField><FormField label="Type"><Chips items={reminderTypes} selected={type} onSelect={(v) => setType(v as CreateReminderInput['type'])} /></FormField><FormField label="Scheduled ISO date/time"><AppInput value={scheduledAt} onChangeText={setScheduledAt} /></FormField><FormField label="Note"><AppInput multiline value={note} onChangeText={setNote} /></FormField><FormField label="Status"><Chips items={['pending', 'completed', 'skipped']} selected={status} onSelect={(v) => setStatus(v as typeof status)} /></FormField><AppButton loading={update.isPending} onPress={submit}>Save changes</AppButton></AppCard></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { gap: disciplineTheme.spacing.lg }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }, title: { color: disciplineTheme.colors.text, fontSize: 20, fontWeight: '800' }, label: { color: disciplineTheme.colors.textFaint, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }, copy: { color: disciplineTheme.colors.textMuted, fontSize: 15, lineHeight: 22 }, meta: { color: disciplineTheme.colors.textFaint, fontSize: 13 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { minHeight: 40, paddingHorizontal: 12 } });
