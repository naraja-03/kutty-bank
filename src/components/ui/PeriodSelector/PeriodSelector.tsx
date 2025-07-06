'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addYears, subYears } from 'date-fns';
import { clsx } from 'clsx';
import { PeriodSelectorProps, PeriodData } from './types';

// Generate month data for the current year
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
    
    // Mock data - replace with actual calculations
    const value = Math.floor(Math.random() * 100000) + 10000;
    const isUnderControl = Math.random() > 0.4; // 60% chance of being under control
    const isActive = month === currentMonth; // Current month is active
    
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
      return 'bg-gray-800/90 border-blue-500/60';
    }
    return period.isUnderControl 
      ? 'bg-green-950/80 border-green-900/60' 
      : 'bg-red-950/80 border-red-900/60';
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setCurrentViewDate(direction === 'next' ? addYears(currentViewDate, 1) : subYears(currentViewDate, 1));
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleNavigation('prev')}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {format(currentViewDate, 'yyyy')}
        </h3>
        <button
          onClick={() => handleNavigation('next')}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Month Grid - 3x4 layout */}
      <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-hide">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelect(period)}
            className={clsx(
              'relative p-4 rounded-xl border-2 transition-colors duration-200',
              'flex flex-col items-center justify-center min-h-[70px]',
              getGradientClass(period)
            )}
          >
            <div className="text-center">
              <div className="text-sm font-medium text-white mb-1">
                {period.label}
              </div>
              <div className="text-xs text-gray-400">
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <Dialog.Title className="text-lg font-medium text-white">
                      Select Month
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Month Grid */}
                <MonthGridSelector
                  selectedDate={new Date()}
                  onSelect={handlePeriodSelect}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
