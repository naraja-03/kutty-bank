'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, Sparkles, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { CustomThreadModalProps, CustomThreadForm } from './types';

export default function CustomThreadModal({
  isOpen,
  onClose,
  onCreateThread,
  className
}: CustomThreadModalProps) {
  const [form, setForm] = useState<CustomThreadForm>({
    label: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: { [key: string]: string } = {};
    
    if (!form.label.trim()) {
      validationErrors.label = 'Thread name is required';
    }
    
    if (!form.startDate) {
      validationErrors.startDate = 'Start date is required';
    }
    
    if (!form.endDate) {
      validationErrors.endDate = 'End date is required';
    }
    
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      validationErrors.endDate = 'End date must be after start date';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onCreateThread(form.label, new Date(form.startDate), new Date(form.endDate));
    handleClose();
  };

  const handleClose = () => {
    setForm({
      label: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof CustomThreadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={clsx(
                'w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 p-6 text-left align-middle shadow-xl transition-all',
                className
              )}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-purple-400" size={24} />
                    <Dialog.Title className="text-xl font-semibold text-white">
                      Create Custom Thread
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Thread Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Thread Name
                    </label>
                    <input
                      type="text"
                      value={form.label}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      placeholder="e.g., Vacation Fund, Q1 Budget"
                      className={clsx(
                        'w-full px-4 py-3 rounded-xl bg-gray-800 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500',
                        errors.label ? 'border-red-500' : 'border-gray-600'
                      )}
                    />
                    {errors.label && (
                      <p className="text-red-400 text-sm mt-1">{errors.label}</p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className={clsx(
                            'w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border text-white focus:outline-none focus:ring-2 focus:ring-purple-500',
                            errors.startDate ? 'border-red-500' : 'border-gray-600'
                          )}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          value={form.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className={clsx(
                            'w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border text-white focus:outline-none focus:ring-2 focus:ring-purple-500',
                            errors.endDate ? 'border-red-500' : 'border-gray-600'
                          )}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {form.label || 'Custom Thread'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {form.startDate && form.endDate
                          ? `${format(new Date(form.startDate), 'MMM dd')} - ${format(new Date(form.endDate), 'MMM dd')}`
                          : 'Select dates'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Create Thread</span>
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
