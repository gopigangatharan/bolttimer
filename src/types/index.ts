/**
 * TypeScript interfaces and types for the Pomodoro Timer application
 */

export interface PomodoroSession {
  id: string;
  taskId?: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  actualDuration: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  interruptions: number;
  focusScore: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
  theme: ThemeType;
}

export interface Statistics {
  totalSessions: number;
  totalFocusTime: number;
  averageFocusScore: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
  productivity: ProductivityAnalysis;
}

export interface DailyStats {
  date: string;
  sessions: number;
  focusTime: number;
  averageFocusScore: number;
  tasksCompleted: number;
}

export interface WeeklyStats {
  weekStart: string;
  sessions: number;
  focusTime: number;
  averageFocusScore: number;
  tasksCompleted: number;
}

export interface ProductivityAnalysis {
  insights: string[];
  recommendations: string[];
  peakHours: number[];
  productivityTrend: 'improving' | 'declining' | 'stable';
  weeklyComparison: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  metric: 'sessions' | 'focusTime' | 'tasks';
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';
export type ThemeType = 'classic' | 'nature' | 'ocean' | 'sunset' | 'minimal';

export interface AppState {
  currentSession: PomodoroSession | null;
  timerState: TimerState;
  timeRemaining: number;
  currentTask: Task | null;
  cycleCount: number;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  sound?: boolean;
}