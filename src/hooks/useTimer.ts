/**
 * Custom hook for timer functionality
 */
import { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNotifications } from './useNotifications';
import { PomodoroSession } from '../types';
import { generateId } from '../utils/helpers';

export function useTimer() {
  const { state, dispatch } = useAppContext();
  const { settings } = useSettings();
  const { showNotification, playSound } = useNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((type: 'work' | 'shortBreak' | 'longBreak') => {
    const duration = getDurationForType(type, settings);
    const session: PomodoroSession = {
      id: generateId(),
      taskId: state.currentTask?.id,
      type,
      duration,
      actualDuration: 0,
      startTime: new Date(),
      completed: false,
      interruptions: 0,
      focusScore: 100,
    };

    dispatch({ type: 'START_TIMER', payload: session });

    if (settings.soundEnabled) {
      playSound('start');
    }

    showNotification({
      title: 'Timer Started',
      body: `${type === 'work' ? 'Work' : 'Break'} session started!`,
      sound: settings.soundEnabled,
    });
  }, [state.currentTask, settings, dispatch, showNotification, playSound]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
    if (settings.soundEnabled) {
      playSound('pause');
    }
  }, [dispatch, settings.soundEnabled, playSound]);

  const resumeTimer = useCallback(() => {
    dispatch({ type: 'RESUME_TIMER' });
    if (settings.soundEnabled) {
      playSound('resume');
    }
  }, [dispatch, settings.soundEnabled, playSound]);

  const stopTimer = useCallback(() => {
    dispatch({ type: 'STOP_TIMER' });
    if (settings.soundEnabled) {
      playSound('stop');
    }
  }, [dispatch, settings.soundEnabled, playSound]);

  const completeSession = useCallback(() => {
    if (state.currentSession) {
      dispatch({ type: 'COMPLETE_SESSION' });
      
      if (settings.soundEnabled) {
        playSound('complete');
      }

      const isWork = state.currentSession.type === 'work';
      showNotification({
        title: 'Session Complete!',
        body: `${isWork ? 'Work' : 'Break'} session finished. Great job!`,
        sound: settings.soundEnabled,
      });

      // Auto-start next session if enabled
      if (isWork && settings.autoStartBreaks) {
        const nextBreak = shouldTakeLongBreak(state.cycleCount, settings.longBreakInterval) 
          ? 'longBreak' 
          : 'shortBreak';
        setTimeout(() => startTimer(nextBreak), 3000);
      } else if (!isWork && settings.autoStartWork) {
        setTimeout(() => startTimer('work'), 3000);
      }

      if (isWork) {
        dispatch({ type: 'INCREMENT_CYCLE' });
      }
    }
  }, [state.currentSession, state.cycleCount, settings, dispatch, showNotification, playSound, startTimer]);

  // Timer countdown effect
  useEffect(() => {
    if (state.timerState === 'running' && state.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', payload: state.timeRemaining - 1 });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (state.timerState === 'running' && state.timeRemaining === 0) {
        completeSession();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timerState, state.timeRemaining, dispatch, completeSession]);

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    completeSession,
  };
}

function getDurationForType(
  type: 'work' | 'shortBreak' | 'longBreak',
  settings: PomodoroSettings
): number {
  switch (type) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}

function shouldTakeLongBreak(cycleCount: number, longBreakInterval: number): boolean {
  return cycleCount > 0 && cycleCount % longBreakInterval === 0;
}