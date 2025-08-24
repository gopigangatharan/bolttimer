/**
 * AI-powered productivity insights component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { Card } from '../ui/Card';

export function ProductivityInsights() {
  const { statistics } = useStatistics();
  const { productivity } = statistics;

  const getTrendIcon = () => {
    switch (productivity.productivityTrend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTrendColor = () => {
    switch (productivity.productivityTrend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendText = () => {
    switch (productivity.productivityTrend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Needs Attention';
      default: return 'Stable';
    }
  };

  const formatPeakHours = (hours: number[]) => {
    if (hours.length === 0) return 'Not enough data';
    
    const formatHour = (hour: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}${period}`;
    };

    if (hours.length === 1) {
      return formatHour(hours[0]);
    }
    
    return `${formatHour(hours[0])} - ${formatHour(hours[hours.length - 1])}`;
  };

  return (
    <div className="space-y-6">
      {/* Productivity Trend */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Productivity Trend</h3>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`font-medium ${getTrendColor()}`}>
              {getTrendText()}
            </span>
          </div>
        </div>
        
        {productivity.weeklyComparison !== 0 && (
          <p className="text-sm text-gray-600">
            {productivity.weeklyComparison > 0 ? '+' : ''}
            {Math.round(productivity.weeklyComparison)}% vs last week
          </p>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Hours</h4>
          <p className="text-lg font-semibold text-gray-900">
            {formatPeakHours(productivity.peakHours)}
          </p>
          <p className="text-sm text-gray-500">
            Your most productive time of day
          </p>
        </div>
      </Card>

      {/* Insights */}
      {productivity.insights.length > 0 && (
        <Card>
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
          </div>
          
          <div className="space-y-3">
            {productivity.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {productivity.recommendations.length > 0 && (
        <Card>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          
          <div className="space-y-3">
            {productivity.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-start space-x-3"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}