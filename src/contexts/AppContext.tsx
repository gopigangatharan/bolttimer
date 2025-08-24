/**
 * Application context for global state management
 */
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, TimerState, PomodoroSession, Task } from '../types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
  | { type: 'START_TIMER'; payload: PomodoroSession }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_TASK'; payload: Task | null }
  | { type: 'INCREMENT_CYCLE' }
  | { type: 'RESET_CYCLE' };

const initialState: AppState = {
  currentSession: null,
  timerState: 'idle',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  currentTask: null,
  cycleCount: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        currentSession: action.payload,
        timerState: 'running',
        timeRemaining: action.payload.duration,
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timerState: 'paused',
      };
    case 'RESUME_TIMER':
      return {
        ...state,
        timerState: 'running',
      };
    case 'STOP_TIMER':
      return {
        ...state,
        timerState: 'idle',
        currentSession: null,
        timeRemaining: state.currentSession?.duration || 25 * 60,
      };
    case 'COMPLETE_SESSION':
      return {
        ...state,
        timerState: 'completed',
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'SET_TASK':
      return {
        ...state,
        currentTask: action.payload,
      };
    case 'INCREMENT_CYCLE':
      return {
        ...state,
        cycleCount: state.cycleCount + 1,
      };
    case 'RESET_CYCLE':
      return {
        ...state,
        cycleCount: 0,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}