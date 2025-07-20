'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { CommitmentsStep, EssentialsStep, FamilyInfoStep, IncomeStep, SavingsStep, SummaryStep } from './index';

export interface FamilySetupData {
  familyInfo: {
    name: string;
    trackingPeriod: 'daily' | 'weekly' | 'monthly';
    startDate: string;
  };
  income: {
    sources: Array<{
      id: string;
      category: string;
      source: string;
      amount: number;
    }>;
    totalIncome: number;
  };
  essentials: {
    categories: Array<{
      id: string;
      name: string;
      amount: number;
    }>;
    totalEssentials: number;
  };
  commitments: {
    categories: Array<{
      id: string;
      name: string;
      amount: number;
    }>;
    totalCommitments: number;
  };
  savings: {
    categories: Array<{
      id: string;
      name: string;
      amount: number;
    }>;
    totalSavings: number;
    availableBalance: number;
  };
}

const STEPS = [
  { id: 'family-info', title: 'Family Info', component: FamilyInfoStep },
  { id: 'income', title: 'Income', component: IncomeStep },
  { id: 'essentials', title: 'Essentials', component: EssentialsStep },
  { id: 'commitments', title: 'Commitments', component: CommitmentsStep },
  { id: 'savings', title: 'Savings', component: SavingsStep },
  { id: 'summary', title: 'Summary', component: SummaryStep },
];

export const FamilySetupContainer = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FamilySetupData>({
    familyInfo: {
      name: '',
      trackingPeriod: 'monthly',
      startDate: '1',
    },
    income: {
      sources: [],
      totalIncome: 0,
    },
    essentials: {
      categories: [],
      totalEssentials: 0,
    },
    commitments: {
      categories: [],
      totalCommitments: 0,
    },
    savings: {
      categories: [],
      totalSavings: 0,
      availableBalance: 0,
    },
  });

  const updateFormData = (stepData: Partial<FamilySetupData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...stepData };
      
      // Recalculate available balance
      const totalIncome = updated.income.totalIncome;
      const totalEssentials = updated.essentials.totalEssentials;
      const totalCommitments = updated.commitments.totalCommitments;
      const availableBalance = totalIncome - totalEssentials - totalCommitments;
      
      updated.savings.availableBalance = Math.max(0, availableBalance);
      
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // API call to create family
      const response = await fetch('/api/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Route to dashboard or family page
        router.push('/dashboard');
      } else {
        console.error('Failed to create family');
      }
    } catch (error) {
      console.error('Error creating family:', error);
    }
  };

  // Calculate budget percentages
  const totalIncome = formData.income.totalIncome;
  const essentialPercentage = totalIncome > 0 ? (formData.essentials.totalEssentials / totalIncome) * 100 : 0;
  const commitmentPercentage = totalIncome > 0 ? (formData.commitments.totalCommitments / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (formData.savings.totalSavings / totalIncome) * 100 : 0;

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen overflow-auto">
      {/* Budget Rule Display - Fixed at top */}
      {totalIncome > 0 && currentStep > 1 && (
        <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
          theme === 'dark' 
            ? 'bg-gray-900/10 border-purple-500/20' 
            : 'bg-white/10 border-purple-300/30'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Budget Rule:</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-orange-400">Essentials:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{essentialPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(50%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-red-400">Commitments:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{commitmentPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(30%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-400">Savings:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{savingsPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(20%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col xl:flex-row ${totalIncome > 0 && currentStep > 1 ? 'pt-12' : ''}`}>
        {/* Left Side - Progress Steps (Desktop) */}
        <div className={`hidden xl:flex xl:w-2/5 flex-col justify-center p-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' 
            : 'bg-gradient-to-br from-purple-50 to-blue-50'
        }`}>
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Family Setup
              </h1>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Set up your family&apos;s financial tracking in a few simple steps.
              </p>
            </div>

            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                    index === currentStep
                      ? theme === 'dark'
                        ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                        : 'bg-purple-100 backdrop-blur-sm border border-purple-300'
                      : index < currentStep
                      ? theme === 'dark'
                        ? 'bg-green-500/20 border border-green-400/30'
                        : 'bg-green-100 border border-green-300'
                      : theme === 'dark'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-gray-100 border border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-4 ${
                      index === currentStep
                        ? 'bg-purple-500 text-white'
                        : index < currentStep
                        ? 'bg-green-500 text-white'
                        : theme === 'dark'
                          ? 'bg-white/10 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check size={16} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        index <= currentStep 
                          ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className={`xl:hidden backdrop-blur-sm border-b ${
          theme === 'dark' 
            ? 'bg-white/10 border-white/10' 
            : 'bg-gray-50/90 border-gray-200'
        }`}>
          <div className="flex items-center justify-between p-4">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className={`flex items-center transition-colors ${
                  theme === 'dark' 
                    ? 'text-white hover:text-purple-300' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <ChevronLeft size={20} className="mr-1" />
                Back
              </button>
            )}
            <div className="flex-1 text-center">
              <h1 className={`text-lg text-center font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {STEPS[currentStep].title}
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="px-4 pb-4">
            <div className={`w-full rounded-full h-1 ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
            }`}>
              <div
                className="bg-purple-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            {/* Step titles below progress bar - centered */}
            <div className="flex justify-between mt-2 text-xs">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center transition-colors ${
                    index <= currentStep
                      ? theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex-1 xl:w-3/5 p-4 lg:p-6 xl:p-8 '
        }`}>
          <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent ? (
                  <CurrentStepComponent
                    data={formData}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onSubmit={handleComplete}
                    isFirstStep={currentStep === 0}
                    isLastStep={currentStep === STEPS.length - 1}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-white text-lg">Loading step component...</div>
                    <div className="text-gray-300 mt-2">Step {currentStep + 1}: {STEPS[currentStep]?.title}</div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
