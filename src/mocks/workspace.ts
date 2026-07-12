import type { DailyPlan, FocusSessionSummary, Goal, Habit, Relationship } from '@/lib/types';

const primaryGoal: Goal = {
  id: 'goal-1',
  title: 'Ship the mobile foundation',
  category: 'business',
  whyItMatters: 'Users should be able to stay on track away from the laptop.',
};

const habits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Review today plan before opening social apps',
    currentStreak: 8,
  },
  {
    id: 'habit-2',
    title: 'Complete one 45-minute focus block',
    currentStreak: 5,
  },
  {
    id: 'habit-3',
    title: 'Write a quick evening reflection',
    currentStreak: 11,
  },
];

const dailyPlan: DailyPlan = {
  date: new Date().toISOString(),
  headline: 'Protect the build window and finish the first mobile shell.',
  focusMinutes: 120,
  focusMinutesDone: 45,
  latestReflection: null,
  primaryGoal,
  nextHabits: habits.slice(0, 2),
  dueReminders: [],
  distractionShield: {
    platform: 'Instagram',
    minutesLost: 18,
    replacementAction: 'Put the phone on grayscale and start the next focus block.',
  },
  partnerNudge: {
    partnerName: 'Aarav',
    message: 'Message Aarav after the second focus block with one thing that shipped.',
  },
  actionSteps: [
    'Open the workspace and confirm the main mobile flow for today.',
    'Finish the Expo app shell and core API integration.',
    'Keep one focus block protected before checking messages.',
  ],
};

const goals: Goal[] = [
  primaryGoal,
  {
    id: 'goal-2',
    title: 'Reduce reactive phone time',
    category: 'personal',
    whyItMatters: 'Attention should feel directed instead of fragmented.',
  },
];

const relationships: Relationship[] = [
  {
    id: 'relationship-1',
    partnerName: 'Aarav',
    status: 'active',
  },
];

const focusSummary: FocusSessionSummary = {
  totalHours: 6.8,
};

export const workspacePreview = {
  dailyPlan,
  goals,
  habits,
  relationships,
  focusSummary,
};
