/**
 * Settings context for user preferences and configuration
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { PomodoroSettings, ThemeType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  settings: PomodoroSettings;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25 * 60, // 25 minutes
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundVolume: 0.5,
  notificationsEnabled: true,
  darkMode: false,
  theme: 'classic',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(
    'pomodoro-settings',
    defaultSettings
  );

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const setTheme = (theme: ThemeType) => {
    updateSettings({ theme });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleTheme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}