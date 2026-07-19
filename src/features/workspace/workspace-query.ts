import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  CompleteHabitInput,
  CreateHabitInput,
  CreateFocusSessionInput,
  CreateGoalInput,
  CreateReflectionInput,
  CreateReminderInput,
  CreateDistractionInput,
  UpdateProfileInput,
  UpdateGoalInput,
  UpdateHabitInput,
  UpdateReminderInput,
  UpdateDistractionInput,
  CreateAiPlanInput,
  CreateRelationshipInput,
  CreateCheckInInput,
} from '@/lib/types';
import {
  completeHabit,
  completeReminder,
  createDistraction,
  createFocusSession,
  createGoal,
  createHabit,
  deleteGoal,
  deleteHabit,
  deleteReminder,
  deleteDistraction,
  fetchGoal,
  fetchHabit,
  createReflection,
  createReminder,
  fetchWorkspaceSnapshot,
  updateProfile,
  updateGoal,
  updateHabit,
  updateReminder,
  updateDistraction,
  createAiPlan,
  activateAiPlan,
  createRelationship,
  fetchRelationship,
  createRelationshipCheckIn,
  deleteRelationship,
} from '@/features/workspace/workspace-service';

export const workspaceQueryKey = ['workspace'] as const;

export function useWorkspaceQuery(token: string | null) {
  return useQuery({
    queryKey: [...workspaceQueryKey, token],
    queryFn: () => fetchWorkspaceSnapshot(token as string),
    enabled: Boolean(token),
  });
}

export function useGoalQuery(token: string | null, id: string) {
  return useQuery({ queryKey: ['goal', id], queryFn: () => fetchGoal(token as string, id), enabled: Boolean(token && id) });
}

export function useHabitQuery(token: string | null, id: string) {
  return useQuery({ queryKey: ['habit', id], queryFn: () => fetchHabit(token as string, id), enabled: Boolean(token && id) });
}
export function useRelationshipQuery(token: string | null, id: string) {
  return useQuery({ queryKey: ['relationship', id], queryFn: () => fetchRelationship(token as string, id), enabled: Boolean(token && id) });
}

function useWorkspaceInvalidation() {
  const queryClient = useQueryClient();

  return async (token: string) => {
    await queryClient.invalidateQueries({
      queryKey: [...workspaceQueryKey, token],
    });
  };
}

export function useCreateGoalMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, CreateGoalInput, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: (input: CreateGoalInput) => createGoal(token, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

function useResourceMutation<T>(token: string, mutationFn: (value: T) => Promise<unknown>) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  return useMutation({ mutationFn, onSuccess: () => invalidateWorkspace(token) });
}

export function useUpdateGoalMutation(token: string) {
  return useResourceMutation(token, ({ id, input }: { id: string; input: UpdateGoalInput }) => updateGoal(token, id, input));
}
export function useDeleteGoalMutation(token: string) {
  return useResourceMutation(token, (id: string) => deleteGoal(token, id));
}
export function useCreateHabitMutation(token: string) {
  return useResourceMutation(token, (input: CreateHabitInput) => createHabit(token, input));
}
export function useUpdateHabitMutation(token: string) {
  return useResourceMutation(token, ({ id, input }: { id: string; input: UpdateHabitInput }) => updateHabit(token, id, input));
}
export function useDeleteHabitMutation(token: string) {
  return useResourceMutation(token, (id: string) => deleteHabit(token, id));
}
export function useUpdateReminderMutation(token: string) {
  return useResourceMutation(token, ({ id, input }: { id: string; input: UpdateReminderInput }) => updateReminder(token, id, input));
}
export function useDeleteReminderMutation(token: string) {
  return useResourceMutation(token, (id: string) => deleteReminder(token, id));
}
export function useCreateDistractionMutation(token: string) {
  return useResourceMutation(token, (input: CreateDistractionInput) => createDistraction(token, input));
}
export function useUpdateDistractionMutation(token: string) {
  return useResourceMutation(token, ({ id, input }: { id: string; input: UpdateDistractionInput }) => updateDistraction(token, id, input));
}
export function useDeleteDistractionMutation(token: string) {
  return useResourceMutation(token, (id: string) => deleteDistraction(token, id));
}
export function useCreateAiPlanMutation(token: string) { return useResourceMutation(token, (input: CreateAiPlanInput) => createAiPlan(token, input)); }
export function useActivateAiPlanMutation(token: string) { return useResourceMutation(token, (id: string) => activateAiPlan(token, id)); }
export function useCreateRelationshipMutation(token: string) { return useResourceMutation(token, (input: CreateRelationshipInput) => createRelationship(token, input)); }
export function useCreateCheckInMutation(token: string) { return useResourceMutation(token, ({ id, input }: { id: string; input: CreateCheckInInput }) => createRelationshipCheckIn(token, id, input)); }
export function useDeleteRelationshipMutation(token: string) { return useResourceMutation(token, (id: string) => deleteRelationship(token, id)); }

export function useCompleteHabitMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, { habitId: string; input: CompleteHabitInput }, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: ({ habitId, input }: { habitId: string; input: CompleteHabitInput }) =>
      completeHabit(token, habitId, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

export function useCreateFocusSessionMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, CreateFocusSessionInput, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: (input: CreateFocusSessionInput) => createFocusSession(token, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

export function useCreateReflectionMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, CreateReflectionInput, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: (input: CreateReflectionInput) => createReflection(token, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

export function useUpdateProfileMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, UpdateProfileInput, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: (input: UpdateProfileInput) => updateProfile(token, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

export function useCreateReminderMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, CreateReminderInput, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: (input: CreateReminderInput) => createReminder(token, input),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}

export function useCompleteReminderMutation(
  token: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, { reminderId: string }, unknown>,
    'mutationFn'
  >,
) {
  const invalidateWorkspace = useWorkspaceInvalidation();
  const onSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    mutationFn: ({ reminderId }: { reminderId: string }) => completeReminder(token, reminderId),
    onSuccess: async (...args) => {
      await invalidateWorkspace(token);
      await onSuccess?.(...args);
    },
  });
}
