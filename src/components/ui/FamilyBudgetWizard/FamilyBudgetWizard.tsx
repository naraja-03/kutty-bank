'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { FamilyBudgetWizardProps, FamilyBudgetData, WIZARD_STEPS } from './types';
import { useAuthenticatedAPI } from '../../../hooks/useAuthenticatedAPI';
import {
  BasicInfoStep,
  IncomeStep,
  EssentialsStep,
  CommitmentsStep,
  SavingsStep,
  SummaryStep
} from './steps';

export default function FamilyBudgetWizard({
  isOpen,
  onClose,
  onComplete,
  editMode = false,
  existingData
}: FamilyBudgetWizardProps) {
  // Authentication check
  const { shouldRedirect, canMakeAPICall } = useAuthenticatedAPI({
    allowAnonymous: true,
    skipRedirect: true // We'll handle this manually since this is a modal
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FamilyBudgetData>({
    basicInfo: {
      name: '',
      period: 'monthly',
      startDay: 1
    },
    categories: [],
    income: [],
    essentials: {
      rent: 0,
      food: 0,
      transport: 0,
      utilities: 0,
      internet: 0,
      education: 0,
      medical: 0
    },
    commitments: {
      loanEmi: 0,
      creditCard: 0,
      subscriptions: 0,
      insurance: 0
    },
    savings: {
      emergencyFund: 0,
      longTermGoal: 0,
      sip: 0
    },
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0
  });

  // Handle authentication redirect effect
  React.useEffect(() => {
    if (shouldRedirect && !canMakeAPICall && isOpen) {
      onClose();
      // Redirect will be handled by the parent component or route guard
      window.location.href = '/welcome';
    }
  }, [shouldRedirect, canMakeAPICall, isOpen, onClose]);

  // Load existing data in edit mode
  useEffect(() => {
    if (editMode && existingData) {
      setFormData(existingData);
    }
  }, [editMode, existingData]);

  const updateFormData = (stepData: Partial<FamilyBudgetData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...stepData };
      
      // Recalculate totals - handle both old and new data formats
      const totalIncome = updated.income.reduce((sum, source) => sum + source.amount, 0);
      
      let totalExpenses = 0;
      if (Array.isArray(updated.essentials)) {
        totalExpenses += updated.essentials.reduce((sum, expense) => sum + expense.amount, 0);
      } else {
        totalExpenses += Object.values(updated.essentials).reduce((sum, val) => sum + val, 0);
      }
      
      if (Array.isArray(updated.commitments)) {
        totalExpenses += updated.commitments.reduce((sum, expense) => sum + expense.amount, 0);
      } else {
        totalExpenses += Object.values(updated.commitments).reduce((sum, val) => sum + val, 0);
      }
      
      let totalSavings = 0;
      if (Array.isArray(updated.savings)) {
        totalSavings = updated.savings.reduce((sum, expense) => sum + expense.amount, 0);
      } else {
        totalSavings = Object.values(updated.savings).reduce((sum, val) => sum + val, 0);
      }
      
      return {
        ...updated,
        totalIncome,
        totalExpenses,
        totalSavings
      };
    });
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
    onClose();
  };

  const handleSwipeDown = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 && info.velocity.y > 300) {
      onClose();
    }
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onComplete: handleComplete,
      editMode
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <IncomeStep {...stepProps} />;
      case 3:
        return <EssentialsStep {...stepProps} />;
      case 4:
        return <CommitmentsStep {...stepProps} />;
      case 5:
        return <SavingsStep {...stepProps} />;
      case 6:
        return <SummaryStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  if (!isOpen) return null;

  if (shouldRedirect && !canMakeAPICall) {
    return null;
  }

  const currentStepData = WIZARD_STEPS[currentStep - 1];
  const progress = (currentStep / WIZARD_STEPS.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          onDragEnd={handleSwipeDown}
          className="w-full bg-gradient-to-br from-gray-900 to-black rounded-t-3xl min-h-[50vh] max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          layout
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-500 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editMode ? 'Edit Family Budget' : 'Create Family Budget'}
                </h2>
                <p className="text-sm text-gray-400">
                  Step {currentStep} of {WIZARD_STEPS.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-2">
            <div className="w-full bg-gray-800 rounded-full h-1">
              <motion.div
                className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 pb-10 scroll-smooth">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {currentStepData.subtitle}
              </p>
            </motion.div>

            {renderStep()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
