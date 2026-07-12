import type {
  CompleteHabitInput,
  CreateHabitInput,
  CreateFocusSessionInput,
  CreateGoalInput,
  CreateReflectionInput,
  CreateReminderInput,
  DailyPlan,
  DailyReflection,
  DailyReflectionSummary,
  FocusSession,
  FocusSessionSummary,
  Goal,
  Habit,
  Reminder,
  Relationship,
  UpdateProfileInput,
  UpdateGoalInput,
  UpdateHabitInput,
  UpdateReminderInput,
  UserProfile,
  WorkspaceSnapshot,
} from '@/lib/types';
import { fetchAuthenticatedUser } from '@/features/auth/auth-service';
import { apiRequest } from '@/shared/api/http-client';

export async function fetchWorkspaceSnapshot(token: string): Promise<WorkspaceSnapshot> {
  const [
    user,
    profile,
    goals,
    habits,
    relationships,
    reminders,
    upcomingReminders,
    dailyPlan,
    reflections,
    reflectionSummary,
    focusSessions,
    focusSessionSummary,
  ] =
    await Promise.all([
      fetchAuthenticatedUser(token),
      apiRequest<UserProfile>('/profile', undefined, token).catch(() => null),
      apiRequest<Goal[]>('/goals', undefined, token),
      apiRequest<Habit[]>('/habits', undefined, token),
      apiRequest<Relationship[]>('/relationships', undefined, token),
      apiRequest<Reminder[]>('/reminders', undefined, token).catch(() => []),
      apiRequest<Reminder[]>('/reminders/upcoming', undefined, token).catch(() => []),
      apiRequest<DailyPlan>('/daily-plan/today', undefined, token).catch(() => null),
      apiRequest<DailyReflection[]>('/reflections', undefined, token).catch(() => []),
      apiRequest<DailyReflectionSummary>('/reflections/summary', undefined, token).catch(() => null),
      apiRequest<FocusSession[]>('/focus-sessions', undefined, token).catch(() => []),
      apiRequest<FocusSessionSummary>('/focus-sessions/summary', undefined, token).catch(() => null),
    ]);

  return {
    user,
    profile,
    goals,
    habits,
    relationships,
    reminders,
    upcomingReminders,
    dailyPlan,
    reflections,
    reflectionSummary,
    focusSessions,
    focusSessionSummary,
  };
}

export async function createGoal(token: string, input: CreateGoalInput) {
  return apiRequest<Goal>(
    '/goals',
    {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        category: input.category,
        ...(input.description ? { description: input.description } : {}),
        ...(input.priority ? { priority: input.priority } : {}),
        ...(input.whyItMatters ? { whyItMatters: input.whyItMatters } : {}),
        ...(input.targetDate ? { targetDate: input.targetDate } : {}),
      }),
    },
    token,
  );
}

export async function fetchGoal(token: string, id: string) {
  return apiRequest<Goal>(`/goals/${id}`, undefined, token);
}

export async function updateGoal(token: string, id: string, input: UpdateGoalInput) {
  return apiRequest<Goal>(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(input) }, token);
}

export async function deleteGoal(token: string, id: string) {
  return apiRequest(`/goals/${id}`, { method: 'DELETE' }, token);
}

export async function createHabit(token: string, input: CreateHabitInput) {
  return apiRequest<Habit>('/habits', { method: 'POST', body: JSON.stringify(input) }, token);
}

export async function fetchHabit(token: string, id: string) {
  return apiRequest<Habit>(`/habits/${id}`, undefined, token);
}

export async function updateHabit(token: string, id: string, input: UpdateHabitInput) {
  return apiRequest<Habit>(`/habits/${id}`, { method: 'PATCH', body: JSON.stringify(input) }, token);
}

export async function deleteHabit(token: string, id: string) {
  return apiRequest(`/habits/${id}`, { method: 'DELETE' }, token);
}

export async function completeHabit(token: string, habitId: string, input: CompleteHabitInput) {
  return apiRequest(
    `/habits/${habitId}/complete`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...(input.note ? { note: input.note } : {}),
      }),
    },
    token,
  );
}

export async function createFocusSession(token: string, input: CreateFocusSessionInput) {
  return apiRequest(
    '/focus-sessions',
    {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        durationMinutes: input.durationMinutes,
        ...(input.goalId ? { goalId: input.goalId } : {}),
        ...(input.habitId ? { habitId: input.habitId } : {}),
        ...(input.energyLevel ? { energyLevel: input.energyLevel } : {}),
        ...(typeof input.distractionFree === 'boolean'
          ? { distractionFree: input.distractionFree }
          : {}),
        ...(input.note ? { note: input.note } : {}),
        ...(input.startedAt ? { startedAt: input.startedAt } : {}),
      }),
    },
    token,
  );
}

export async function createReflection(token: string, input: CreateReflectionInput) {
  return apiRequest<DailyReflection>(
    '/reflections',
    {
      method: 'POST',
      body: JSON.stringify({
        mood: input.mood,
        ...(input.wins ? { wins: input.wins } : {}),
        ...(input.blockers ? { blockers: input.blockers } : {}),
        ...(input.distractions ? { distractions: input.distractions } : {}),
        ...(input.tomorrowCommitment ? { tomorrowCommitment: input.tomorrowCommitment } : {}),
        focusScore: input.focusScore,
      }),
    },
    token,
  );
}

export async function updateProfile(token: string, input: UpdateProfileInput) {
  return apiRequest<UserProfile>(
    '/profile',
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
    token,
  );
}

export async function createReminder(token: string, input: CreateReminderInput) {
  return apiRequest<Reminder>(
    '/reminders',
    {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        type: input.type,
        scheduledAt: input.scheduledAt,
        ...(input.note ? { note: input.note } : {}),
      }),
    },
    token,
  );
}

export async function updateReminder(token: string, id: string, input: UpdateReminderInput) {
  return apiRequest<Reminder>(`/reminders/${id}`, { method: 'PATCH', body: JSON.stringify(input) }, token);
}

export async function deleteReminder(token: string, id: string) {
  return apiRequest(`/reminders/${id}`, { method: 'DELETE' }, token);
}

export async function completeReminder(token: string, reminderId: string) {
  return apiRequest<Reminder>(
    `/reminders/${reminderId}/complete`,
    {
      method: 'POST',
    },
    token,
  );
}
