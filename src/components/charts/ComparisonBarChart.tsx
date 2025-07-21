'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ComparisonData {
  name: string;
  planned: number;
  actual: number;
}

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

export default function ComparisonBarChart({ data, title }: ComparisonBarChartProps) {
  const { theme } = useTheme();

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-white/30 border-white/40 text-gray-900'
        }`}>
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span> ₹{entry.value.toLocaleString()}
            </p>
          ))}
          {payload.length === 2 && (
            <p className="text-sm mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
              <span className="font-semibold">Difference:</span> ₹{Math.abs(payload[1].value - payload[0].value).toLocaleString()}
              <span className={`ml-1 ${
                payload[1].value > payload[0].value ? 'text-red-500' : 'text-green-500'
              }`}>
                ({payload[1].value > payload[0].value ? 'Over' : 'Under'} budget)
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm ${
      theme === 'dark'
        ? 'bg-white/5 border-white/10'
        : 'bg-white/20 border-white/30'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="planned" 
              name="Planned"
              fill={theme === 'dark' ? '#3b82f6' : '#2563eb'}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              name="Actual"
              fill={theme === 'dark' ? '#10b981' : '#059669'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
