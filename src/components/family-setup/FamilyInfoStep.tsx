'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup } from '@/contexts/FamilySetupContext';
import { useRouter } from 'next/navigation';
import { setAnonymousUser } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

interface FamilyInfoStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOverBudget?: boolean;
  totalSpendingPercentage?: number;
}

const TRACKING_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const START_DATES = [
  { value: '1', label: '1st of Month' },
  { value: '5', label: '5th of Month' },
  { value: '7', label: '7th of Month' },
  { value: '10', label: '10th of Month' },
];
export const FamilyInfoStep = ({ onNext }: FamilyInfoStepProps) => {
  const { formData, updateFormData } = useFamilySetup();
  const [familyName, setFamilyName] = useState(formData.familyInfo.name);
  const [trackingPeriod, setTrackingPeriod] = useState(formData.familyInfo.trackingPeriod);
  const [startDate, setStartDate] = useState(formData.familyInfo.startDate);
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignIn = () => {
    dispatch(setAnonymousUser(true));

    router.push('/welcome');
  };

  const handleNext = () => {
    if (familyName.trim()) {
      updateFormData({
        familyInfo: {
          name: familyName.trim(),
          trackingPeriod,
          startDate,
        },
      });
      onNext();
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-sm rounded-2xl p-6 lg:p-8 mb-10 border ${theme === 'dark'
          ? 'bg-gray-900/90 border-purple-500/30'
          : 'bg-white/90 border-purple-300/50'
          }`}
      >
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'
            }`}>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            Family Information
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Let&apos;s start by setting up your family&apos;s financial tracking
          </p>
        </div>

        <div className="space-y-6">
          {/* Family Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Family Name *
            </label>
            <Input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter your family name"
              className="w-full"
              icon={<Users size={20} />}
              variant={theme === 'dark' ? 'default' : 'filled'}
            />
          </div>

          {/* Tracking Period */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Tracking Period
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TRACKING_PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setTrackingPeriod(period.value as 'daily' | 'weekly' | 'monthly')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${trackingPeriod === period.value
                    ? theme === 'dark'
                      ? 'bg-purple-500 text-white border-2 border-purple-400'
                      : 'bg-purple-500 text-white border-2 border-purple-400'
                    : theme === 'dark'
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-2 border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                    }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date - Only show for Monthly */}
          {trackingPeriod === 'monthly' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Start Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                {START_DATES.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setStartDate(date.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${startDate === date.value
                      ? theme === 'dark'
                        ? 'bg-purple-500 text-white border-2 border-purple-400'
                        : 'bg-purple-500 text-white border-2 border-purple-400'
                      : theme === 'dark'
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-2 border-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                      }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="flex items-center"

          >
            ← SignIn
          </Button>
          <Button
            onClick={handleNext}
            disabled={!familyName.trim()}
            className={`flex items-center ${theme === 'dark'
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
          >
            Continue →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
