import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import {
  useCompleteHabitMutation,
  useCreateFocusSessionMutation,
  useCreateGoalMutation,
  useCreateReminderMutation,
} from '@/features/workspace/workspace-query';
import type { CreateReminderInput, Goal, Habit } from '@/lib/types';

const goalCategories = [
  'personal',
  'health',
  'career',
  'study',
  'business',
  'finance',
  'relationship',
] as const;

const focusMinuteOptions = ['25', '45', '60', '90'] as const;
const reminderTypes: CreateReminderInput['type'][] = [
  'habit',
  'goal',
  'accountability',
  'distraction_replacement',
];

function SelectionChip({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, isActive ? styles.chipActive : null]}>
      <Text style={[styles.chipText, isActive ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function ActionMessage({
  tone,
  text,
}: {
  tone: 'success' | 'error';
  text: string;
}) {
  return (
    <View style={[styles.message, tone === 'success' ? styles.successMessage : styles.errorMessage]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
}

export function GoalActionForm({ token }: { token: string }) {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<(typeof goalCategories)[number]>('personal');
  const [goalWhy, setGoalWhy] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createGoalMutation = useCreateGoalMutation(token, {
    onSuccess: async (_, variables) => {
      setGoalTitle('');
      setGoalWhy('');
      setSuccessMessage(`Goal created: ${variables.title}`);
      setLocalError(null);
    },
  });

  function submitGoal() {
    setLocalError(null);
    setSuccessMessage(null);

    if (!goalTitle.trim()) {
      setLocalError('Add a goal title before creating it.');
      return;
    }

    createGoalMutation.mutate({
      title: goalTitle.trim(),
      category: goalCategory,
      ...(goalWhy.trim() ? { whyItMatters: goalWhy.trim() } : {}),
    });
  }

  const activeError = localError ?? createGoalMutation.error?.message ?? null;

  return (
    <View style={styles.form}>
      {successMessage ? <ActionMessage tone="success" text={successMessage} /> : null}
      {activeError ? <ActionMessage tone="error" text={activeError} /> : null}

      <TextInput
        onChangeText={setGoalTitle}
        placeholder="Goal title"
        placeholderTextColor="#93a4be"
        style={styles.input}
        value={goalTitle}
      />
      <Text style={styles.fieldLabel}>Category</Text>
      <View style={styles.chipWrap}>
        {goalCategories.map((category) => (
          <SelectionChip
            key={category}
            isActive={goalCategory === category}
            label={category}
            onPress={() => setGoalCategory(category)}
          />
        ))}
      </View>
      <TextInput
        onChangeText={setGoalWhy}
        placeholder="Why this matters"
        placeholderTextColor="#93a4be"
        style={[styles.input, styles.textArea]}
        multiline
        value={goalWhy}
      />
      <Pressable
        disabled={createGoalMutation.isPending}
        onPress={submitGoal}
        style={[styles.button, createGoalMutation.isPending ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>
          {createGoalMutation.isPending ? 'Creating...' : 'Create goal'}
        </Text>
      </Pressable>
    </View>
  );
}

export function FocusSessionActionForm({
  goals,
  habits,
  token,
}: {
  goals: Goal[];
  habits: Habit[];
  token: string;
}) {
  const [focusTitle, setFocusTitle] = useState('');
  const [focusMinutes, setFocusMinutes] = useState<(typeof focusMinuteOptions)[number]>('45');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goals[0]?.id ?? null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [focusNote, setFocusNote] = useState('');
  const [distractionFree, setDistractionFree] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? null,
    [goals, selectedGoalId],
  );
  const selectedHabit = useMemo(
    () => habits.find((habit) => habit.id === selectedHabitId) ?? null,
    [habits, selectedHabitId],
  );

  useEffect(() => {
    if (!selectedGoalId && goals[0]) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  useEffect(() => {
    if (selectedHabit || !habits[0]) {
      return;
    }

    if (selectedHabitId && !habits.some((habit) => habit.id === selectedHabitId)) {
      setSelectedHabitId(null);
    }
  }, [habits, selectedHabit, selectedHabitId]);

  const createFocusSessionMutation = useCreateFocusSessionMutation(token, {
    onSuccess: async (_, variables) => {
      setFocusTitle('');
      setFocusMinutes('45');
      setSelectedHabitId(null);
      setFocusNote('');
      setDistractionFree(true);
      setSuccessMessage(`Focus session logged: ${variables.title}`);
      setLocalError(null);
    },
  });

  function submitFocusSession() {
    setLocalError(null);
    setSuccessMessage(null);

    const minutes = Number(focusMinutes);

    if (!focusTitle.trim()) {
      setLocalError('Add a focus session title.');
      return;
    }

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 720) {
      setLocalError('Focus minutes must be between 1 and 720.');
      return;
    }

    createFocusSessionMutation.mutate({
      title: focusTitle.trim(),
      durationMinutes: minutes,
      distractionFree,
      ...(selectedGoal ? { goalId: selectedGoal.id } : {}),
      ...(selectedHabit ? { habitId: selectedHabit.id } : {}),
      ...(focusNote.trim() ? { note: focusNote.trim() } : {}),
    });
  }

  const activeError = localError ?? createFocusSessionMutation.error?.message ?? null;

  return (
    <View style={styles.form}>
      {successMessage ? <ActionMessage tone="success" text={successMessage} /> : null}
      {activeError ? <ActionMessage tone="error" text={activeError} /> : null}

      <TextInput
        onChangeText={setFocusTitle}
        placeholder="What should this session finish?"
        placeholderTextColor="#93a4be"
        style={styles.input}
        value={focusTitle}
      />
      <Text style={styles.fieldLabel}>Session length</Text>
      <View style={styles.chipWrap}>
        {focusMinuteOptions.map((minutes) => (
          <SelectionChip
            key={minutes}
            isActive={focusMinutes === minutes}
            label={`${minutes} min`}
            onPress={() => setFocusMinutes(minutes)}
          />
        ))}
      </View>
      {goals.length ? (
        <>
          <Text style={styles.fieldLabel}>Link a goal</Text>
          <View style={styles.chipWrap}>
            {goals.slice(0, 6).map((goal) => (
              <SelectionChip
                key={goal.id}
                isActive={selectedGoalId === goal.id}
                label={goal.title}
                onPress={() => setSelectedGoalId(goal.id)}
              />
            ))}
          </View>
        </>
      ) : null}
      {habits.length ? (
        <>
          <Text style={styles.fieldLabel}>Optional habit</Text>
          <View style={styles.chipWrap}>
            <SelectionChip
              isActive={selectedHabitId === null}
              label="No habit"
              onPress={() => setSelectedHabitId(null)}
            />
            {habits.slice(0, 6).map((habit) => (
              <SelectionChip
                key={habit.id}
                isActive={selectedHabitId === habit.id}
                label={habit.title}
                onPress={() => setSelectedHabitId(habit.id)}
              />
            ))}
          </View>
        </>
      ) : null}
      <TextInput
        onChangeText={setFocusNote}
        placeholder="Short note"
        placeholderTextColor="#93a4be"
        style={[styles.input, styles.textArea]}
        multiline
        value={focusNote}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Distraction-free</Text>
        <Switch onValueChange={setDistractionFree} value={distractionFree} />
      </View>
      <Pressable
        disabled={createFocusSessionMutation.isPending}
        onPress={submitFocusSession}
        style={[styles.button, createFocusSessionMutation.isPending ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>
          {createFocusSessionMutation.isPending ? 'Logging...' : 'Log focus session'}
        </Text>
      </Pressable>
    </View>
  );
}

export function HabitCompletionActionForm({
  habits,
  token,
}: {
  habits: Habit[];
  token: string;
}) {
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(habits[0]?.id ?? null);
  const [habitNote, setHabitNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedHabit = useMemo(
    () => habits.find((habit) => habit.id === selectedHabitId) ?? null,
    [habits, selectedHabitId],
  );

  useEffect(() => {
    if (!selectedHabitId && habits[0]) {
      setSelectedHabitId(habits[0].id);
      return;
    }

    if (selectedHabitId && !habits.some((habit) => habit.id === selectedHabitId)) {
      setSelectedHabitId(habits[0]?.id ?? null);
    }
  }, [habits, selectedHabitId]);

  const completeHabitMutation = useCompleteHabitMutation(token, {
    onSuccess: async () => {
      setHabitNote('');
      setSuccessMessage(selectedHabit ? `Habit completed: ${selectedHabit.title}` : 'Habit completed.');
      setLocalError(null);
    },
  });

  function submitHabitCompletion() {
    setLocalError(null);
    setSuccessMessage(null);

    if (!selectedHabit) {
      setLocalError('Choose a habit to complete.');
      return;
    }

    completeHabitMutation.mutate({
      habitId: selectedHabit.id,
      input: habitNote.trim() ? { note: habitNote.trim() } : {},
    });
  }

  const activeError = localError ?? completeHabitMutation.error?.message ?? null;

  return (
    <View style={styles.form}>
      {successMessage ? <ActionMessage tone="success" text={successMessage} /> : null}
      {activeError ? <ActionMessage tone="error" text={activeError} /> : null}

      <Text style={styles.fieldLabel}>Choose the habit you finished</Text>
      <View style={styles.chipWrap}>
        {habits.slice(0, 8).map((habit) => (
          <SelectionChip
            key={habit.id}
            isActive={selectedHabitId === habit.id}
            label={habit.title}
            onPress={() => setSelectedHabitId(habit.id)}
          />
        ))}
      </View>
      {selectedHabit ? (
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionSummaryTitle}>{selectedHabit.title}</Text>
          <Text style={styles.selectionSummaryMeta}>
            Current streak: {selectedHabit.currentStreak} days
          </Text>
        </View>
      ) : null}
      <TextInput
        onChangeText={setHabitNote}
        placeholder="Optional completion note"
        placeholderTextColor="#93a4be"
        style={[styles.input, styles.textArea]}
        multiline
        value={habitNote}
      />
      <Pressable
        disabled={completeHabitMutation.isPending}
        onPress={submitHabitCompletion}
        style={[styles.button, completeHabitMutation.isPending ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>
          {completeHabitMutation.isPending ? 'Saving...' : 'Complete habit'}
        </Text>
      </Pressable>
    </View>
  );
}

export function ReminderActionForm({ token }: { token: string }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CreateReminderInput['type']>('goal');
  const [scheduledAt, setScheduledAt] = useState('');
  const [note, setNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createReminderMutation = useCreateReminderMutation(token, {
    onSuccess: async (_, variables) => {
      setTitle('');
      setScheduledAt('');
      setNote('');
      setSuccessMessage(`Reminder created: ${variables.title}`);
      setLocalError(null);
    },
  });

  function submitReminder() {
    setLocalError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setLocalError('Add a reminder title.');
      return;
    }

    const parsedDate = new Date(scheduledAt);

    if (!scheduledAt.trim() || Number.isNaN(parsedDate.getTime())) {
      setLocalError('Use a valid date time, for example 2026-07-02T18:30:00.');
      return;
    }

    createReminderMutation.mutate({
      title: title.trim(),
      type,
      scheduledAt: parsedDate.toISOString(),
      ...(note.trim() ? { note: note.trim() } : {}),
    });
  }

  const activeError = localError ?? createReminderMutation.error?.message ?? null;

  return (
    <View style={styles.form}>
      {successMessage ? <ActionMessage tone="success" text={successMessage} /> : null}
      {activeError ? <ActionMessage tone="error" text={activeError} /> : null}

      <TextInput
        onChangeText={setTitle}
        placeholder="Reminder title"
        placeholderTextColor="#93a4be"
        style={styles.input}
        value={title}
      />
      <Text style={styles.fieldLabel}>Reminder type</Text>
      <View style={styles.chipWrap}>
        {reminderTypes.map((reminderType) => (
          <SelectionChip
            key={reminderType}
            isActive={type === reminderType}
            label={reminderType.replace(/_/g, ' ')}
            onPress={() => setType(reminderType)}
          />
        ))}
      </View>
      <TextInput
        autoCapitalize="none"
        onChangeText={setScheduledAt}
        placeholder="Scheduled at (example: 2026-07-02T18:30:00)"
        placeholderTextColor="#93a4be"
        style={styles.input}
        value={scheduledAt}
      />
      <TextInput
        onChangeText={setNote}
        placeholder="Optional note"
        placeholderTextColor="#93a4be"
        style={[styles.input, styles.textArea]}
        multiline
        value={note}
      />
      <Pressable
        disabled={createReminderMutation.isPending}
        onPress={submitReminder}
        style={[styles.button, createReminderMutation.isPending ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>
          {createReminderMutation.isPending ? 'Creating...' : 'Create reminder'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  fieldLabel: {
    color: '#b8cae3',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: '#ffcf88',
    borderColor: '#ffcf88',
  },
  chipText: {
    color: '#dbe7f7',
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#17325d',
  },
  input: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    color: '#fef8ef',
    fontSize: 15,
  },
  textArea: {
    minHeight: 92,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 18,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffcf88',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#17325d',
    fontSize: 15,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#fef8ef',
    fontSize: 15,
    fontWeight: '700',
  },
  selectionSummary: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 4,
  },
  selectionSummaryTitle: {
    color: '#fef8ef',
    fontSize: 15,
    fontWeight: '700',
  },
  selectionSummaryMeta: {
    color: '#b8cae3',
    fontSize: 13,
  },
  message: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successMessage: {
    backgroundColor: 'rgba(109, 214, 153, 0.2)',
  },
  errorMessage: {
    backgroundColor: 'rgba(195,72,72,0.22)',
  },
  messageText: {
    color: '#fef8ef',
    fontSize: 14,
    lineHeight: 21,
  },
});
