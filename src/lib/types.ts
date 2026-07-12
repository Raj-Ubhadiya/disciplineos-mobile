export type Environment = 'development' | 'test' | 'production';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export type ApiHealthResponse = {
  status: 'ok' | 'degraded';
  service: 'api';
  environment: Environment;
  database: 'up' | 'down';
  timestamp: string;
};

export type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type AuthOtpChannel = 'email' | 'phone';

export type AuthOtpPurpose = 'login' | 'signup';

export type RequestOtpResponse = {
  message: string;
  debugCode?: string;
};

export type UserProfile = {
  id?: string;
  userId?: string;
  mainDream: string | null;
  currentLifeFocus: string | null;
  biggestDistractions: string[];
  dailyFocusMinutes: number;
  preferredReminderTone: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Goal = {
  id: string;
  userId?: string;
  relationshipId?: string | null;
  title: string;
  description?: string | null;
  category: string;
  whyItMatters: string | null;
  priority?: number;
  status?: string;
  targetDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Habit = {
  id: string;
  userId?: string;
  goalId?: string | null;
  title: string;
  currentStreak: number;
  frequency?: string;
  reminderTime?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Relationship = {
  id: string;
  ownerId?: string;
  partnerId?: string | null;
  partnerName: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FocusSessionSummary = {
  totalSessions?: number;
  totalMinutes?: number;
  totalHours: number;
  distractionFreeSessions?: number;
  latestSessionTitle?: string | null;
};

export type FocusSession = {
  id: string;
  title: string;
  durationMinutes: number;
  distractionFree: boolean;
  energyLevel?: string | null;
  note?: string | null;
  startedAt?: string;
  createdAt?: string;
  goalId?: string | null;
  habitId?: string | null;
};

export type CreateGoalInput = {
  title: string;
  category: string;
  description?: string;
  priority?: number;
  whyItMatters?: string;
  targetDate?: string;
};

export type UpdateGoalInput = Partial<CreateGoalInput> & { status?: string };

export type CreateHabitInput = {
  title: string;
  goalId?: string;
  frequency?: string;
  reminderTime?: string;
};

export type UpdateHabitInput = Partial<Omit<CreateHabitInput, 'goalId' | 'reminderTime'>> & {
  goalId?: string | null;
  reminderTime?: string | null;
  currentStreak?: number;
};

export type CompleteHabitInput = {
  note?: string;
};

export type CreateFocusSessionInput = {
  title: string;
  durationMinutes: number;
  goalId?: string;
  habitId?: string;
  energyLevel?: string;
  distractionFree?: boolean;
  note?: string;
  startedAt?: string;
};

export type UpdateProfileInput = {
  mainDream?: string;
  currentLifeFocus?: string;
  biggestDistractions?: string[];
  dailyFocusMinutes?: number;
  preferredReminderTone?: string;
};

export type CreateReminderInput = {
  title: string;
  type: 'habit' | 'goal' | 'accountability' | 'distraction_replacement';
  scheduledAt: string;
  note?: string;
};

export type UpdateReminderInput = Partial<CreateReminderInput> & {
  status?: 'pending' | 'completed' | 'skipped';
};

export type Reminder = {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  note: string | null;
  status: string;
  completedAt?: string | null;
};

export type DailyReflection = {
  id: string;
  mood: string;
  wins: string | null;
  blockers: string | null;
  distractions: string | null;
  tomorrowCommitment: string | null;
  focusScore: number;
  createdAt: string;
};

export type DailyReflectionSummary = {
  averageFocusScore: number;
  totalReflections: number;
  latestMood: string | null;
  latestCommitment: string | null;
};

export type CreateReflectionInput = {
  mood: string;
  wins?: string;
  blockers?: string;
  distractions?: string;
  tomorrowCommitment?: string;
  focusScore: number;
};

export type DailyPlan = {
  date: string;
  headline: string;
  focusMinutes: number;
  focusMinutesDone: number;
  latestReflection: DailyReflection | null;
  primaryGoal: Goal | null;
  nextHabits: Habit[];
  dueReminders: Reminder[];
  distractionShield: {
    platform: string | null;
    minutesLost: number;
    replacementAction: string;
  };
  partnerNudge: {
    partnerName: string | null;
    message: string;
  };
  actionSteps: string[];
};

export type WorkspaceSnapshot = {
  user: AuthUser;
  profile: UserProfile | null;
  goals: Goal[];
  habits: Habit[];
  relationships: Relationship[];
  reminders: Reminder[];
  upcomingReminders: Reminder[];
  dailyPlan: DailyPlan | null;
  reflections: DailyReflection[];
  reflectionSummary: DailyReflectionSummary | null;
  focusSessions: FocusSession[];
  focusSessionSummary: FocusSessionSummary | null;
};
