'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Target, Mail, User, Crown, Shield, Eye } from 'lucide-react';
import { FamilyModalProps, FamilyFormData, FamilyMember } from './types';

const FamilyModal: React.FC<FamilyModalProps> = ({
  isOpen,
  onClose,
  onSelectFamily,
  onCreateFamily,
  families,
  isLoading,
  canDismiss = true
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<FamilyFormData>({
    name: '',
    targetSavingPerMonth: 0,
    members: [] // Start with empty members array
  });

  useEffect(() => {
    if (families.length === 0) {
      setShowCreateForm(true);
    }
  }, [families]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { email: '', name: '', role: 'member' }]
    }));
  };

  const handleRemoveMember = (index: number) => {
    if (formData.members.length > 1) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateFamily(formData);
    // Don't close modal here - let parent handle it after successful API call
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={14} className="text-yellow-500" />;
      case 'member': return <Shield size={14} className="text-blue-500" />;
      case 'viewer': return <Eye size={14} className="text-gray-500" />;
      default: return <User size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {showCreateForm ? 'Create Family' : 'Select Family'}
          </h2>
          {canDismiss && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!showCreateForm ? (
            <>
              {/* Family Selection */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : families.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">No families found</p>
                  <p className="text-sm text-gray-500 mt-2">Create a family to get started</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {families.map((family) => {
                    const familyId = family.id || `temp-family-${Date.now()}`;
                    return (
                      <button
                        key={familyId}
                        onClick={() => onSelectFamily(familyId)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2">
                            <Users size={20} className="text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                              {family.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {family.members?.length || 0} members
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Create Family Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl border border-dashed border-gray-700 hover:border-gray-600 bg-gray-800/30 hover:bg-gray-800/50 transition-all"
              >
                <Plus size={20} className="text-gray-400" />
                <span className="text-gray-400">Create New Family</span>
              </button>
            </>
          ) : (
            /* Create Family Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Family Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Family Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter family name"
                  required
                />
              </div>

              {/* Target Saving Per Month */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Saving Per Month (₹)
                </label>
                <div className="relative">
                  <Target size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={formData.targetSavingPerMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetSavingPerMonth: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Family Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Family Members
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.members.map((member, index) => (
                    <div key={`member-${index}-${member.email || member.name || index}`} className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Name</label>
                          <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                              placeholder="Member name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Email</label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                              placeholder="email@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Role</label>
                          <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                              <select
                                value={member.role}
                                onChange={(e) => handleMemberChange(index, 'role', e.target.value as 'admin' | 'member' | 'viewer')}
                                className="w-full pl-3 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                              >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <div className="absolute right-2 top-2">
                                {getRoleIcon(member.role)}
                              </div>
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(index)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                {families.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  Create Family
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyModal;
