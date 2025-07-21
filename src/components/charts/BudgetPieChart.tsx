'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface BudgetData {
  name: string;
  value: number;
  color: string;
  planned?: number;
}

interface BudgetPieChartProps {
  data: BudgetData[];
  title: string;
  type?: 'actual' | 'comparison';
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: BudgetData & { totalValue: number };
  }>;
}

interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

export default function BudgetPieChart({ data, title, type = 'actual' }: BudgetPieChartProps) {
  const { theme } = useTheme();

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-white/30 border-white/40 text-gray-900'
        }`}>
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span className="font-semibold">Actual:</span> ₹{data.value.toLocaleString()}
          </p>
          {type === 'comparison' && data.planned && (
            <p className="text-sm">
              <span className="font-semibold">Planned:</span> ₹{data.planned.toLocaleString()}
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Percentage:</span> {((data.value / data.totalValue) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: LegendProps) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, totalValue: total }));

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
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ percent }: { percent?: number }) => percent ? `${(percent * 100).toFixed(1)}%` : ''}
              labelLine={false}
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {total > 0 && (
        <div className={`mt-4 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Total: ₹{total.toLocaleString()}
        </div>
      )}
    </div>
  );
}
