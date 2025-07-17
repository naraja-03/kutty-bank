'use client';

import { ReactNode } from 'react';
import { Check, Plus } from 'lucide-react';
import BottomSheet from '../BottomSheet';

export interface ListItem {
  id: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ListItem) => void;
  title: string;
  subtitle?: string;
  items: ListItem[];
  selectedId?: string;
  showCreateNew?: boolean;
  onCreateNew?: () => void;
  createNewText?: string;
  emptyText?: string;
  isLoading?: boolean;
}

export default function ListModal({
  isOpen,
  onClose,
  onSelect,
  title,
  subtitle,
  items,
  selectedId,
  showCreateNew = false,
  onCreateNew,
  createNewText = 'Create New',
  emptyText = 'No items available',
  isLoading = false
}: ListModalProps) {
  const handleSelect = (item: ListItem) => {
    if (!item.disabled) {
      onSelect(item);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxHeight="max-h-[80vh]"
    >
      <div className="space-y-4">
        {/* Create New Button */}
        {showCreateNew && onCreateNew && (
          <button
            onClick={onCreateNew}
            className="w-full flex items-center gap-3 p-4 bg-blue-500/30 border border-blue-400/40 rounded-xl text-blue-300 hover:bg-blue-500/40 transition-colors"
            disabled={isLoading}
          >
            <div className="w-10 h-10 bg-blue-500/40 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">{createNewText}</span>
          </button>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Items List */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors text-left ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : selectedId === item.id
                    ? 'bg-blue-500/30 border border-blue-400/40'
                    : 'bg-white/5 hover:bg-white/10 border border-white/20'
                }`}
              >
                {/* Icon or Avatar */}
                {item.icon && (
                  <div className="w-10 h-10 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{item.label}</h3>
                  {item.subtitle && (
                    <p className="text-sm text-gray-400 truncate">{item.subtitle}</p>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedId === item.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">{emptyText}</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
