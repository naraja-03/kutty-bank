'use client';

import { ReactNode, FormEvent } from 'react';
import BottomSheet from '../BottomSheet';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  value: string | number;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string | number>) => void;
  title: string;
  subtitle?: string;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: string | number) => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  children?: ReactNode;
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  fields,
  onFieldChange,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
  showDeleteButton = false,
  onDelete,
  children
}: FormModalProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as Record<string, string | number>);
    onSubmit(data);
  };

  const renderField = (field: FormField) => {
    const baseInputClasses = "w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors";
    
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.id}
            value={field.value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
            required={field.required}
            disabled={field.disabled || isLoading}
          >
            <option value="" disabled>Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={field.value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClasses} min-h-[100px] resize-none`}
            required={field.required}
            disabled={field.disabled || isLoading}
          />
        );
      
      default:
        return (
          <input
            id={field.id}
            type={field.type}
            value={field.value}
            onChange={(e) => onFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            required={field.required}
            disabled={field.disabled || isLoading}
          />
        );
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium text-white/80">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        {/* Custom Children */}
        {children}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          {/* Delete Button (if shown) */}
          {showDeleteButton && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full py-3 px-4 bg-red-500/80 border border-red-400/40 hover:bg-red-500/90 rounded-xl text-white font-medium transition-colors"
              disabled={isLoading}
            >
              Delete
            </button>
          )}
          
          {/* Submit and Cancel */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-500/80 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                submitText
              )}
            </button>
          </div>
        </div>
      </form>
    </BottomSheet>
  );
}
