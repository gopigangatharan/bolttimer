/**
 * Main application component with navigation and routing
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';

import { AppProvider } from './contexts/AppContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { TimerDisplay } from './components/timer/TimerDisplay';
import { TaskManager } from './components/tasks/TaskManager';
import { StatisticsOverview } from './components/analytics/StatisticsOverview';
import { ProductivityChart } from './components/charts/ProductivityChart';
import { ProductivityInsights } from './components/analytics/ProductivityInsights';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { Button } from './components/ui/Button';

type TabType = 'timer' | 'tasks' | 'analytics' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, toggleTheme } = useSettings();

  useKeyboardShortcuts();

  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: Timer },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <div className="max-w-md mx-auto">
            <TimerDisplay />
          </div>
        );
      case 'tasks':
        return <TaskManager />;
      case 'analytics':
        return (
          <div className="space-y-8">
            <StatisticsOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityChart type="line" metric="sessions" period="daily" />
              <ProductivityChart type="bar" metric="focusTime" period="daily" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityChart type="line" metric="focusScore" period="weekly" />
              <ProductivityInsights />
            </div>
          </div>
        );
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      settings.darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors ${
        settings.darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">Focus Timer</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {settings.darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile overlay */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transition-colors ${
                  settings.darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border-r lg:translate-x-0`}
              >
                <div className="flex items-center justify-between p-4 lg:hidden">
                  <span className="text-lg font-semibold">Navigation</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? settings.darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-50 text-blue-600'
                          : settings.darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className={`fixed bottom-4 right-4 p-3 rounded-lg text-xs transition-colors ${
        settings.darkMode 
          ? 'bg-gray-800 text-gray-300 border border-gray-700' 
          : 'bg-white text-gray-600 border border-gray-200'
      } shadow-lg`}>
        <div className="space-y-1">
          <div>Space: Play/Pause</div>
          <div>Ctrl+R: Reset</div>
          <div>Ctrl+1/2/3: Start Work/Short/Long Break</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AppProvider>
  );
}

export default App;