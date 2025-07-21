'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FamilySetupProvider, useFamilySetup } from '@/contexts/FamilySetupContext';
import { CommitmentsStep, EssentialsStep, FamilyInfoStep, IncomeStep, SavingsStep, SummaryStep } from './index';
import { useCreateFamilyMutation } from '@/store/api/familyApi';

const STEPS = [
  { id: 'family-info', title: 'Family Info', component: FamilyInfoStep },
  { id: 'income', title: 'Income', component: IncomeStep },
  { id: 'essentials', title: 'Essentials', component: EssentialsStep },
  { id: 'commitments', title: 'Commitments', component: CommitmentsStep },
  { id: 'savings', title: 'Savings', component: SavingsStep },
  { id: 'summary', title: 'Summary', component: SummaryStep },
];

const FamilySetupContent = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { formData, budget } = useFamilySetup();
  const [currentStep, setCurrentStep] = useState(0);
  const [createFamily] = useCreateFamilyMutation();

  const nextStep = () => {
    // Prevent going to next step if over budget (except on the last step)
    if (currentStep < STEPS.length - 1 && budget.isOverBudget && currentStep > 1) {
      return; // Don't proceed if over budget
    }
    
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
      console.log('Creating family with data:', formData);
      // API call to create family using RTK Query
      await createFamily(formData).unwrap();
      router.push('/dashboard');
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        console.error('Error creating family:', error);
      } else {
        console.error('Error creating family:', error);
      }
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen overflow-auto">
      {/* Budget Rule Display - Fixed at top */}
      {budget.totalIncome > 0 && currentStep > 1 && (
        <div className={`hidden xl:flex fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
          budget.isOverBudget
            ? theme === 'dark' 
              ? 'bg-red-900/20 border-red-500/30' 
              : 'bg-red-50/90 border-red-300/50'
            : theme === 'dark' 
              ? 'bg-gray-900/10 border-purple-500/20' 
              : 'bg-white/10 border-purple-300/30'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${
                  budget.isOverBudget
                    ? theme === 'dark' ? 'text-red-300' : 'text-red-700'
                    : theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {budget.isOverBudget ? 'Over Budget!' : 'Budget Rule:'}
                </span>
                {budget.isOverBudget && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-red-500/20 text-red-300' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {budget.totalSpendingPercentage.toFixed(1)}% of income
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-orange-400">Essentials:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{budget.essentialPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(50%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-red-400">Commitments:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{budget.commitmentPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(30%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-400">Savings:</span>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{budget.savingsPercentage.toFixed(1)}%</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>(20%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col xl:flex-row ${budget.totalIncome > 0 && currentStep > 1 ? 'pt-12' : ''}`}>
        {/* Left Side - Progress Steps (Desktop) */}
        <div className={"hidden xl:flex xl:w-2/5 flex-col justify-center p-8"}>
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
                    onNext={nextStep}
                    onPrev={prevStep}
                    onSubmit={currentStep === STEPS.length - 1 ? handleComplete : () => {}}
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

export const FamilySetupContainer = () => {
  return (
    <FamilySetupProvider>
      <FamilySetupContent />
    </FamilySetupProvider>
  );
};
