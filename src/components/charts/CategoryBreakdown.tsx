'use client';

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryItem {
    id: string;
    name: string;
    planned: number;
    actual: number;
}

interface CategoryBreakdownProps {
    title: string;
    categories: CategoryItem[];
    color: string;
}

export default function CategoryBreakdown({ title, categories, color }: CategoryBreakdownProps) {
    const { theme } = useTheme();

    const getStatusIcon = (planned: number, actual: number) => {
        const diff = actual - planned;
        const percentage = Math.abs(diff / planned) * 100;

        if (percentage <= 5) {
            return <TrendingUp className="text-green-500" size={16} />;
        } else if (diff > 0) {
            return <TrendingDown className="text-red-500" size={16} />;
        } else {
            return <AlertTriangle className="text-yellow-500" size={16} />;
        }
    };

    const getStatusText = (planned: number, actual: number) => {
        const diff = actual - planned;
        const percentage = Math.abs(diff / planned) * 100;

        if (percentage <= 5) {
            return { text: 'On Track', color: 'text-green-500' };
        } else if (diff > 0) {
            return { text: `Over by ₹${diff.toLocaleString()}`, color: 'text-red-500' };
        } else {
            return { text: `Under by ₹${Math.abs(diff).toLocaleString()}`, color: 'text-yellow-600' };
        }
    };

    const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
    const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);

    return (
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-white/20 border-white/30'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    {title}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium`} style={{ backgroundColor: `${color}20`, color }}>
                    {categories.length} items
                </div>
            </div>

            {/* Summary */}
            <div className={`p-4 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Total Planned vs Actual
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                ₹{totalPlanned.toLocaleString()}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className={`font-semibold ${totalActual > totalPlanned ? 'text-red-500' : 'text-green-500'
                                }`}>
                                ₹{totalActual.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-start sm:justify-end">
                        {getStatusIcon(totalPlanned, totalActual)}
                    </div>
                </div>
            </div>

            {/* Category List */}
            <div className="space-y-3">
                {categories.map((category) => {
                    const status = getStatusText(category.planned, category.actual);
                    const progressPercentage = (category.actual / category.planned) * 100;

                    return (
                        <div
                            key={category.id}
                            className={`p-4 rounded-lg border ${theme === 'dark'
                                    ? 'bg-gray-700/30 border-gray-600'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {category.name}
                                </h4>
                                {getStatusIcon(category.planned, category.actual)}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Planned: ₹{category.planned.toLocaleString()}
                                    </span>
                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Actual: ₹{category.actual.toLocaleString()}
                                    </span>
                                </div>
                                <span className={`text-sm ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/30'
                                }`}>
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(progressPercentage, 100)}%`,
                                        backgroundColor: progressPercentage > 100 ? '#ef4444' : color
                                    }}
                                />
                            </div>

                            <div className="flex justify-between mt-1">
                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                    0%
                                </span>
                                <span className={`text-xs ${progressPercentage > 100 ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {progressPercentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
