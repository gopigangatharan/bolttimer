/**
 * Custom hook for keyboard shortcuts
 */
import { useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useTimer } from './useTimer';

export function useKeyboardShortcuts() {
  const { state } = useAppContext();
  const { startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key.toLowerCase();
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    switch (key) {
      case ' ':
      case 'spacebar':
        event.preventDefault();
        if (state.timerState === 'idle') {
          startTimer('work');
        } else if (state.timerState === 'running') {
          pauseTimer();
        } else if (state.timerState === 'paused') {
          resumeTimer();
        }
        break;
      
      case 'r':
        if (isCtrlOrCmd) {
          event.preventDefault();
          stopTimer();
        }
        break;
      
      case '1':
        if (isCtrlOrCmd && state.timerState === 'idle') {
          event.preventDefault();
          startTimer('work');
        }
        break;
      
      case '2':
        if (isCtrlOrCmd && state.timerState === 'idle') {
          event.preventDefault();
          startTimer('shortBreak');
        }
        break;
      
      case '3':
        if (isCtrlOrCmd && state.timerState === 'idle') {
          event.preventDefault();
          startTimer('longBreak');
        }
        break;
    }
  }, [state.timerState, startTimer, pauseTimer, resumeTimer, stopTimer]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}