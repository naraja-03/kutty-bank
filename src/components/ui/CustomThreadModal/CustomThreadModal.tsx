'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Sparkles, Calendar, Target, FileText, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { CustomThreadModalProps, CustomThreadFormData } from './types';
import { createCustomThread, updateCustomThread, removeSavedThread } from '@/store/slices/threadsSlice';

export default function CustomThreadModal({ 
  isOpen, 
  onClose, 
  mode = 'create',
  threadData 
}: CustomThreadModalProps) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<CustomThreadFormData>({
    name: '',
    description: '',
    targetAmount: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form data when modal opens or threadData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && threadData) {
        setFormData(threadData);
      } else {
        // Reset form for create mode
        const today = new Date();
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setFormData({
          name: '',
          description: '',
          targetAmount: 0,
          startDate: today,
          endDate: endOfMonth,
        });
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, mode, threadData]);

  const handleInputChange = (field: keyof CustomThreadFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = new Date(value);
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (mode === 'create') {
      dispatch(createCustomThread({
        label: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        targetAmount: formData.targetAmount,
      }));
    } else if (mode === 'edit' && threadData?.id) {
      dispatch(updateCustomThread({
        id: threadData.id,
        label: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        targetAmount: formData.targetAmount,
      }));
    }

    onClose();
  };

  const handleDelete = () => {
    if (threadData?.id) {
      dispatch(removeSavedThread(threadData.id));
      onClose();
    }
  };

  const getPreviewText = () => {
    if (!formData.name) return 'Custom Thread';
    const start = format(formData.startDate, 'MMM dd');
    const end = format(formData.endDate, 'MMM dd');
    return `${formData.name} • ${start} - ${end}`;
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <Dialog.Title className="text-lg font-medium text-white">
                      {mode === 'create' ? 'Create Custom Thread' : 'Edit Thread'}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <Trash2 className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Delete Thread</h3>
                      <p className="text-gray-400 text-sm">
                        Are you sure you want to delete &ldquo;{formData.name}&rdquo;? This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Form */}
                    <div className="space-y-5">
                      {/* Thread Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <FileText className="w-4 h-4" />
                          Thread Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="e.g., Vacation Fund, Q1 Budget"
                          className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <FileText className="w-4 h-4" />
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Brief description of this thread's purpose..."
                          rows={3}
                          className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Target Amount */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <Target className="w-4 h-4" />
                          Target Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            type="number"
                            value={formData.targetAmount || ''}
                            onChange={(e) => handleInputChange('targetAmount', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="w-4 h-4" />
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={format(formData.startDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="w-4 h-4" />
                            End Date
                          </label>
                          <input
                            type="date"
                            value={format(formData.endDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange('endDate', e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                        <div className="text-xs text-gray-400 mb-1">Preview</div>
                        <div className="text-sm text-white font-medium">{getPreviewText()}</div>
                        {formData.description && (
                          <div className="text-xs text-gray-400 mt-1">{formData.description}</div>
                        )}
                        {formData.targetAmount > 0 && (
                          <div className="text-xs text-green-400 mt-1">Target: ₹{formData.targetAmount.toLocaleString()}</div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      {mode === 'edit' && (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!formData.name.trim()}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {mode === 'create' ? 'Create Thread' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
