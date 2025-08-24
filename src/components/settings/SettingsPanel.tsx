/**
 * Settings and preferences panel
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Volume2, Bell, Clock } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { ThemeType } from '../../types';
import { formatTime } from '../../utils/helpers';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function SettingsPanel() {
  const { settings, updateSettings, toggleTheme, setTheme } = useSettings();

  const themes: { value: ThemeType; label: string; colors: string[] }[] = [
    { value: 'classic', label: 'Classic', colors: ['#ef4444', '#f87171', '#fca5a5'] },
    { value: 'nature', label: 'Nature', colors: ['#22c55e', '#4ade80', '#86efac'] },
    { value: 'ocean', label: 'Ocean', colors: ['#3b82f6', '#60a5fa', '#93c5fd'] },
    { value: 'sunset', label: 'Sunset', colors: ['#f97316', '#fb923c', '#fdba74'] },
    { value: 'minimal', label: 'Minimal', colors: ['#6b7280', '#9ca3af', '#d1d5db'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      {/* Timer Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Timer Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Duration
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="900"
                max="3600"
                step="300"
                value={settings.workDuration}
                onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-mono text-gray-600 w-12">
                {formatTime(settings.workDuration)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Break
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="300"
                max="900"
                step="60"
                value={settings.shortBreakDuration}
                onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-mono text-gray-600 w-12">
                {formatTime(settings.shortBreakDuration)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Break
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="900"
                max="1800"
                step="300"
                value={settings.longBreakDuration}
                onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-mono text-gray-600 w-12">
                {formatTime(settings.longBreakDuration)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long Break Interval (every N work sessions)
          </label>
          <input
            type="number"
            min="2"
            max="8"
            value={settings.longBreakInterval}
            onChange={(e) => updateSettings({ longBreakInterval: parseInt(e.target.value) })}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-start breaks</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoStartWork}
              onChange={(e) => updateSettings({ autoStartWork: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-start work sessions</span>
          </label>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={toggleTheme}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Dark mode</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themes.map((theme) => (
                <motion.button
                  key={theme.value}
                  onClick={() => setTheme(theme.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-center space-x-1 mb-2">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-700">{theme.label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Sound Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sound & Notifications</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Enable sound effects</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(settings.soundVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.soundVolume}
              onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-full"
              disabled={!settings.soundEnabled}
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Enable browser notifications</span>
          </label>
        </div>
      </Card>
    </div>
  );
}