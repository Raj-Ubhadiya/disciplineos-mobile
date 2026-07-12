import type { WorkspaceSnapshot } from '@/lib/types';

export function getVisibleHabits(workspace: WorkspaceSnapshot) {
  const { dailyPlan, habits } = workspace;

  if (dailyPlan?.nextHabits.length) {
    return dailyPlan.nextHabits;
  }

  return habits.slice(0, 3);
}

export function getActionSteps(workspace: WorkspaceSnapshot) {
  return workspace.dailyPlan?.actionSteps ?? ['Create your first goal to generate a real daily plan.'];
}

export function getFocusProgress(workspace: WorkspaceSnapshot) {
  const focusMinutes = workspace.dailyPlan?.focusMinutes ?? 0;
  const focusMinutesDone = workspace.dailyPlan?.focusMinutesDone ?? 0;

  if (!focusMinutes) {
    return 0;
  }

  return Math.round((focusMinutesDone / focusMinutes) * 100);
}
