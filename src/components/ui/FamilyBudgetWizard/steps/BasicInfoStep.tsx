'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Clock, ChevronDown } from 'lucide-react';
import { FamilyBudgetData } from '../types';

interface BasicInfoStepProps {
  data: FamilyBudgetData;
  onUpdate: (data: Partial<FamilyBudgetData>) => void;
  onNext: () => void;
  editMode: boolean;
}

export default function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startDayOptions = [
    { value: 1, label: '1st' },
    { value: 5, label: '5th' },
    { value: 10, label: '10th' },
    { value: 15, label: '15th' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleNameChange = (name: string) => {
    onUpdate({
      basicInfo: {
        ...data.basicInfo,
        name
      }
    });
  };

  const handlePeriodChange = (period: 'weekly' | 'monthly' | 'yearly') => {
    onUpdate({
      basicInfo: {
        ...data.basicInfo,
        period
      }
    });
  };

  const handleStartDayChange = (startDay: number) => {
    onUpdate({
      basicInfo: {
        ...data.basicInfo,
        startDay
      }
    });
  };

  const canProceed = data.basicInfo.name.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Decorative icons - simplified and faster */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0, duration: 0.2 }}
          className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30"
        >
          <User className="w-5 h-5 text-purple-400" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="w-8 h-8 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center border border-gray-500/30"
        >
          <Calendar className="w-4 h-4 text-gray-400" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-orange-500/30"
        >
          <Clock className="w-5 h-5 text-orange-400" />
        </motion.div>
      </div>

      {/* Name input - more compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
          Name
        </label>
        <input
          type="text"
          value={data.basicInfo.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="My Household"
          className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-base"
        />
      </motion.div>

      {/* Budget period - more compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
          Budget Period
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period as 'weekly' | 'monthly' | 'yearly')}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                data.basicInfo.period === period
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)} budget
            </button>
          ))}
        </div>
      </motion.div>

      {/* Monthly start day - optimized dropdown */}
      {data.basicInfo.period === 'monthly' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-30"
        >
          <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
            Monthly Start Day
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-base flex items-center justify-between transition-all duration-150"
            >
              <span>
                {startDayOptions.find(option => option.value === data.basicInfo.startDay)?.label || '1st'} of the month
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <AnimatePresence mode="wait">
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-xl overflow-hidden mb-5"
                >
                  <div className="max-h-40 overflow-y-auto">
                    {startDayOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleStartDayChange(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors duration-100 text-sm ${
                          data.basicInfo.startDay === option.value 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'text-white'
                        }`}
                      >
                        {option.label} of the month
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Continue button - more compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-8 mt-4"
      >
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
            canProceed
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
