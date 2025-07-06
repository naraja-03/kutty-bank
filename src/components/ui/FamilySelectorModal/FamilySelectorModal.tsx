'use client';

import React from 'react';
import { X, Users, Check } from 'lucide-react';
import { FamilySelectorModalProps } from './types';
import { useGetFamilyQuery } from '@/store/api/familyApi';

const FamilySelectorModal: React.FC<FamilySelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectFamily,
}) => {
  const { data: family, isLoading } = useGetFamilyQuery();

  if (!isOpen) return null;

  const handleSelectFamily = (familyId: string) => {
    onSelectFamily(familyId);
    onClose();
  };

  // For now, we'll show a message about single family support
  // Later this can be extended to support multiple families
  const familyData = family ? [family] : [];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Select Family</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : familyData.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No families found</p>
              <p className="text-sm text-gray-500 mt-2">Create a family to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {familyData.map((familyItem) => (
                <button
                  key={familyItem.id}
                  onClick={() => handleSelectFamily(familyItem.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2">
                      <Users size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {familyItem.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {familyItem.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <Check size={20} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilySelectorModal;
