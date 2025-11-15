/**
 * Main timer display component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function TimerDisplay() {
  const { state } = useAppContext();
  const { startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  const progress = state.currentSession 
    ? ((state.currentSession.duration - state.timeRemaining) / state.currentSession.duration) * 100
    : 0;

  const getSessionLabel = () => {
    if (!state.currentSession) return 'Ready to start';
    switch (state.currentSession.type) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Session';
    }
  };

  const getSessionColor = () => {
    if (!state.currentSession) return 'text-gray-600';
    switch (state.currentSession.type) {
      case 'work': return 'text-red-600';
      case 'shortBreak': return 'text-green-600';
      case 'longBreak': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="text-center">
      <div className="space-y-6">
        <div>
          <h2 className={`text-xl font-semibold ${getSessionColor()}`}>
            {getSessionLabel()}
          </h2>
          {state.currentTask && (
            <p className="text-sm text-gray-600 mt-1">
              Working on: {state.currentTask.title}
            </p>
          )}
        </div>

        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              className={getSessionColor()}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={state.timerState}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
              className="text-center"
            >
              <div className="text-4xl font-mono font-bold text-gray-900">
                {formatTime(state.timeRemaining)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Cycle {state.cycleCount + 1}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          {state.timerState === 'idle' && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => startTimer('work')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Work
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => startTimer('shortBreak')}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Short Break
                </Button>
              </motion.div>
            </>
          )}
          
          {state.timerState === 'running' && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={pauseTimer} variant="secondary">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={stopTimer} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </motion.div>
            </>
          )}
          
          {state.timerState === 'paused' && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={resumeTimer} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={stopTimer} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </motion.div>
            </>
          )}
          
          {state.timerState === 'completed' && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => startTimer('work')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Next Session
              </Button>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> to play/pause</div>
          <div>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+R</kbd> to reset</div>
        </div>
      </div>
    </Card>
  );
}
