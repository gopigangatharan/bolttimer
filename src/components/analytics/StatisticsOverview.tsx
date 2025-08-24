/**
 * Statistics overview component with key metrics
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { Card } from '../ui/Card';
import { formatDuration } from '../../utils/helpers';

export function StatisticsOverview() {
  const { statistics } = useStatistics();

  const metrics = [
    {
      label: 'Total Sessions',
      value: statistics.totalSessions,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Focus Time',
      value: formatDuration(statistics.totalFocusTime),
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Current Streak',
      value: `${statistics.currentStreak} days`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Focus Score',
      value: `${Math.round(statistics.averageFocusScore)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="h-full">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}