'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addYears, subYears } from 'date-fns';
import BottomSheet from '../BottomSheet';
import { PeriodSelectorProps, PeriodData } from './types';


const generateMonthData = (baseDate: Date): PeriodData[] => {
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const data: PeriodData[] = [];
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear, month, 1);
    const label = `${monthNames[month]} ${currentYear}`;
    

    const value = Math.floor(Math.random() * 100000) + 10000;
    const isUnderControl = Math.random() > 0.4;
    const isActive = month === currentMonth;
    
    data.push({
      id: `month-${month}`,
      label,
      date,
      value,
      isUnderControl,
      isActive
    });
  }
  
  return data;
};

function MonthGridSelector({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (period: PeriodData) => void }) {
  const [currentViewDate, setCurrentViewDate] = useState(selectedDate);
  const [periods, setPeriods] = useState<PeriodData[]>([]);

  useEffect(() => {
    const data = generateMonthData(currentViewDate);
    setPeriods(data);
  }, [currentViewDate]);

  const getGradientClass = (period: PeriodData) => {
    if (period.isActive) {
      return 'bg-white/10 border-blue-400/60';
    }
    return period.isUnderControl 
      ? 'bg-green-500/20 border-green-400/60' 
      : 'bg-red-500/20 border-red-400/60';
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setCurrentViewDate(direction === 'next' ? addYears(currentViewDate, 1) : subYears(currentViewDate, 1));
  };

  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleNavigation('prev')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {format(currentViewDate, 'yyyy')}
        </h3>
        <button
          onClick={() => handleNavigation('next')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-3">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelect(period)}
            className={`relative p-4 rounded-xl border-2 transition-colors duration-200 flex flex-col items-center justify-center min-h-[70px] ${getGradientClass(period)}`}
          >
            <div className="text-center">
              <div className="text-sm font-medium text-white mb-1">
                {period.label}
              </div>
              <div className="text-xs text-white/70">
                ₹{period.value.toLocaleString()}
              </div>
              {period.isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PeriodSelector({ 
  isOpen, 
  onClose, 
  onPeriodSelect 
}: PeriodSelectorProps) {
  const handlePeriodSelect = (period: PeriodData) => {
    onPeriodSelect(period);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select Month"
      maxHeight="max-h-[80vh]"
    >
      <MonthGridSelector
        selectedDate={new Date()}
        onSelect={handlePeriodSelect}
      />
    </BottomSheet>
  );
}
