/**
 * Productivity chart component using Recharts
 */
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStatistics } from '../../hooks/useStatistics';
import { Card } from '../ui/Card';
import { formatDuration } from '../../utils/helpers';

interface ProductivityChartProps {
  type: 'line' | 'bar';
  metric: 'sessions' | 'focusTime' | 'focusScore';
  period: 'daily' | 'weekly';
}

export function ProductivityChart({ type, metric, period }: ProductivityChartProps) {
  const { statistics } = useStatistics();
  
  const data = useMemo(() => {
    const rawData = period === 'daily' ? statistics.dailyStats : statistics.weeklyStats;
    
    return rawData.map(item => ({
      ...item,
      date: period === 'daily' ? item.date : `Week of ${item.weekStart || item.date}`,
      displayValue: metric === 'focusTime' ? item[metric] / 60 : item[metric], // Convert to minutes for display
    }));
  }, [statistics, period, metric]);

  const getMetricLabel = () => {
    switch (metric) {
      case 'sessions': return 'Sessions';
      case 'focusTime': return 'Focus Time (minutes)';
      case 'focusScore': return 'Focus Score';
      default: return 'Value';
    }
  };

  const formatValue = (value: number) => {
    if (metric === 'focusTime') {
      return formatDuration(value * 60); // Convert back to seconds for formatting
    }
    if (metric === 'focusScore') {
      return `${Math.round(value)}%`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            {getMetricLabel()}: {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? (
    <Line 
      type="monotone" 
      dataKey="displayValue" 
      stroke="#3b82f6" 
      strokeWidth={2}
      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
      activeDot={{ r: 6, fill: '#1d4ed8' }}
    />
  ) : (
    <Bar dataKey="displayValue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
  );

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {period === 'daily' ? 'Daily' : 'Weekly'} {getMetricLabel()}
        </h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                if (period === 'daily') {
                  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                return value.replace('Week of ', '');
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            {DataComponent}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}