/**
 * Custom hook for statistics and analytics
 */
import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PomodoroSession, Task, Statistics, DailyStats, WeeklyStats, ProductivityAnalysis } from '../types';
import { startOfDay, startOfWeek, format, subDays, subWeeks } from 'date-fns';

export function useStatistics() {
  const [sessions] = useLocalStorage<PomodoroSession[]>('pomodoro-sessions', []);
  const [tasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);

  const statistics = useMemo((): Statistics => {
    const completedSessions = sessions.filter(session => session.completed);
    const totalFocusTime = completedSessions.reduce((total, session) => 
      total + (session.type === 'work' ? session.actualDuration : 0), 0
    );

    const averageFocusScore = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => sum + session.focusScore, 0) / completedSessions.length
      : 0;

    const completedTasks = tasks.filter(task => task.completed);
    
    // Calculate current streak
    const currentStreak = calculateCurrentStreak(completedSessions);
    const longestStreak = calculateLongestStreak(completedSessions);

    // Generate daily and weekly stats
    const dailyStats = generateDailyStats(completedSessions, completedTasks);
    const weeklyStats = generateWeeklyStats(dailyStats);

    // AI-powered productivity analysis
    const productivity = generateProductivityAnalysis(dailyStats, weeklyStats, completedSessions);

    return {
      totalSessions: completedSessions.length,
      totalFocusTime,
      averageFocusScore,
      tasksCompleted: completedTasks.length,
      currentStreak,
      longestStreak,
      dailyStats,
      weeklyStats,
      productivity,
    };
  }, [sessions, tasks]);

  return { statistics };
}

function calculateCurrentStreak(sessions: PomodoroSession[]): number {
  const today = startOfDay(new Date());
  let streak = 0;
  let currentDate = today;

  while (true) {
    const dayStart = startOfDay(currentDate);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayHasSessions = sessions.some(session => 
      session.startTime >= dayStart && 
      session.startTime < dayEnd &&
      session.type === 'work'
    );

    if (dayHasSessions) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(sessions: PomodoroSession[]): number {
  const workSessions = sessions.filter(s => s.type === 'work');
  if (workSessions.length === 0) return 0;

  const dates = [...new Set(workSessions.map(s => format(s.startTime, 'yyyy-MM-dd')))].sort();
  
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  return Math.max(longest, current);
}

function generateDailyStats(sessions: PomodoroSession[], tasks: Task[]): DailyStats[] {
  const stats = new Map<string, DailyStats>();
  
  // Initialize last 30 days
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    stats.set(date, {
      date,
      sessions: 0,
      focusTime: 0,
      averageFocusScore: 0,
      tasksCompleted: 0,
    });
  }

  // Process sessions
  sessions.forEach(session => {
    if (!session.completed || session.type !== 'work') return;
    
    const date = format(session.startTime, 'yyyy-MM-dd');
    const stat = stats.get(date);
    
    if (stat) {
      stat.sessions++;
      stat.focusTime += session.actualDuration;
      stat.averageFocusScore = (stat.averageFocusScore * (stat.sessions - 1) + session.focusScore) / stat.sessions;
    }
  });

  // Process completed tasks
  tasks.forEach(task => {
    if (!task.completed || !task.completedAt) return;
    
    const date = format(task.completedAt, 'yyyy-MM-dd');
    const stat = stats.get(date);
    
    if (stat) {
      stat.tasksCompleted++;
    }
  });

  return Array.from(stats.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function generateWeeklyStats(dailyStats: DailyStats[]): WeeklyStats[] {
  const weekStats = new Map<string, WeeklyStats>();

  dailyStats.forEach(day => {
    const weekStart = format(startOfWeek(new Date(day.date)), 'yyyy-MM-dd');
    
    if (!weekStats.has(weekStart)) {
      weekStats.set(weekStart, {
        weekStart,
        sessions: 0,
        focusTime: 0,
        averageFocusScore: 0,
        tasksCompleted: 0,
      });
    }

    const week = weekStats.get(weekStart)!;
    week.sessions += day.sessions;
    week.focusTime += day.focusTime;
    week.tasksCompleted += day.tasksCompleted;
  });

  // Calculate average focus scores
  weekStats.forEach(week => {
    const weekDays = dailyStats.filter(day => {
      const weekStartDate = startOfWeek(new Date(day.date));
      return format(weekStartDate, 'yyyy-MM-dd') === week.weekStart;
    });

    const validDays = weekDays.filter(day => day.sessions > 0);
    if (validDays.length > 0) {
      week.averageFocusScore = validDays.reduce((sum, day) => sum + day.averageFocusScore, 0) / validDays.length;
    }
  });

  return Array.from(weekStats.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

function generateProductivityAnalysis(
  dailyStats: DailyStats[],
  weeklyStats: WeeklyStats[],
  sessions: PomodoroSession[]
): ProductivityAnalysis {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // Analyze recent performance
  const recentDays = dailyStats.slice(-7);
  const averageRecentSessions = recentDays.reduce((sum, day) => sum + day.sessions, 0) / 7;
  const averageRecentFocus = recentDays.reduce((sum, day) => sum + day.averageFocusScore, 0) / 7;

  if (averageRecentSessions >= 6) {
    insights.push('You\'ve been highly productive this week!');
  } else if (averageRecentSessions >= 4) {
    insights.push('Good consistency in your work sessions.');
  } else {
    insights.push('Consider increasing your daily session count.');
    recommendations.push('Try to complete at least 4-6 Pomodoro sessions per day.');
  }

  if (averageRecentFocus >= 85) {
    insights.push('Your focus quality is excellent.');
  } else if (averageRecentFocus >= 70) {
    insights.push('Your focus quality is good with room for improvement.');
    recommendations.push('Try minimizing distractions during work sessions.');
  } else {
    insights.push('Focus quality could be improved.');
    recommendations.push('Consider using website blockers or finding a quieter workspace.');
  }

  // Analyze peak hours
  const hourCounts = new Array(24).fill(0);
  sessions.forEach(session => {
    if (session.type === 'work') {
      const hour = session.startTime.getHours();
      hourCounts[hour]++;
    }
  });

  const maxCount = Math.max(...hourCounts);
  const peakHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .filter(item => item.count === maxCount)
    .map(item => item.hour);

  // Determine productivity trend
  const thisWeek = weeklyStats[weeklyStats.length - 1];
  const lastWeek = weeklyStats[weeklyStats.length - 2];
  
  let productivityTrend: 'improving' | 'declining' | 'stable' = 'stable';
  let weeklyComparison = 0;

  if (thisWeek && lastWeek) {
    weeklyComparison = ((thisWeek.sessions - lastWeek.sessions) / lastWeek.sessions) * 100;
    
    if (weeklyComparison > 10) {
      productivityTrend = 'improving';
      insights.push(`Your productivity has improved by ${Math.round(weeklyComparison)}% this week!`);
    } else if (weeklyComparison < -10) {
      productivityTrend = 'declining';
      insights.push(`Your productivity has declined by ${Math.round(Math.abs(weeklyComparison))}% this week.`);
      recommendations.push('Consider reviewing your goals and removing potential obstacles.');
    }
  }

  return {
    insights,
    recommendations,
    peakHours,
    productivityTrend,
    weeklyComparison,
  };
}