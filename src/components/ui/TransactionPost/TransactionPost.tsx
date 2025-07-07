'use client';

import { clsx } from 'clsx';
import { MessageCircle, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { TransactionPostProps } from './types';
import { useState, useEffect } from 'react';
import { formatCurrency, formatTime } from '../../../lib/formatters';

export default function TransactionPost({
  id,
  userName,
  amount,
  category,
  createdAt,
  type,
  note,
  className,
  onEdit,
  onDelete,
  onUpdateNote,
  showActions = true
}: TransactionPostProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(note || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);



  const handleSaveNote = () => {
    if (id && onUpdateNote) {
      onUpdateNote(id, editedNote);
    }
    setEditingNote(false);
  };

  const handleCancelEdit = () => {
    setEditedNote(note || '');
    setEditingNote(false);
  };

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
    }
    setDropdownOpen(false);
  };

  const handleDeleteTransaction = () => {
    if (id && onDelete) {
      onDelete(id);
    }
    setShowDeleteModal(false);
    setDropdownOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      food: 'Food',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      bills: 'Bills',
      healthcare: 'Healthcare',
      education: 'Education',
      salary: 'Salary',
      business: 'Business',
      investment: 'Investment',
      allowance: 'Allowance',
      gift: 'Gift',
      other: 'Other'
    };
    return iconMap[category] || 'Other';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getStatusText = () => {
    if (type === 'income') {
      return `received ${formatCurrency(amount)} from ${category}`;
    } else {
      return `spent ${formatCurrency(amount)} on ${category}`;
    }
  };

  return (
    <div className={clsx(
      'bg-black border-b border-gray-800 p-4 hover:bg-gray-950 transition-colors duration-200',
      className
    )}>
      <div className="flex items-start space-x-3">
        {/* Profile Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
            <span className="text-white text-sm font-semibold">
              {getInitials(userName)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium text-sm">{userName}</span>
              <span className="text-gray-500 text-xs">
                {formatTime(createdAt)}
              </span>
            </div>
            
            {/* Three-dot menu */}
            <div className="relative dropdown-container">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {dropdownOpen && showActions && (
                <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thread-style Content */}
          <div className="space-y-3">
            {/* Transaction Status */}
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <span className="px-2 py-1 bg-gray-800 rounded-md text-xs font-medium">
                {getCategoryIcon(category)}
              </span>
              <span>{getStatusText()}</span>
            </div>

            {/* Amount Display */}
            <div className={clsx(
              'text-2xl font-bold',
              type === 'income' ? 'text-green-400' : 'text-red-400'
            )}>
              {type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(amount))}
            </div>

            {/* Note - with inline editing */}
            {editingNote ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Add a note..."
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              note && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {note}
                </p>
              )
            )}

            {/* Interaction Bar - Reply only */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-400 transition-colors">
                  <MessageCircle size={16} />
                  <span>Reply</span>
                </button>
              </div>

              {/* Category Tag */}
              <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded-full">
                <span className="text-xs text-gray-400">#{category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Transaction</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTransaction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
