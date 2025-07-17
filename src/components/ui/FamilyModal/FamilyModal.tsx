'use client';

import React, { useState, useEffect } from 'react';
import { Crown, Shield, Eye, User, Plus, X, Users, Mail } from 'lucide-react';
import { FamilyModalProps, FamilyFormData, FamilyMember } from './types';
import BottomSheet from '../BottomSheet';

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
    members: []
  });

  useEffect(() => {
    if (families.length === 0) {
      setShowCreateForm(true);
    }
  }, [families]);

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { email: '', name: '', role: 'member' }]
    }));
  };

  const handleRemoveMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
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
    <BottomSheet 
      isOpen={isOpen} 
      onClose={canDismiss ? onClose : () => {}}
      title={showCreateForm ? 'Create Family' : 'Select Family'}
    >
      {!showCreateForm ? (
          <>
            
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
                      onClick={() => onSelectFamily(family.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 bg-gray-800/50 hover:bg-gray-800/70 transition-all group backdrop-blur-sm"
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

            
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl border border-dashed border-gray-700/50 hover:border-gray-600/50 bg-gray-800/30 hover:bg-gray-800/50 transition-all backdrop-blur-sm"
            >
              <Plus size={20} className="text-gray-400" />
              <span className="text-gray-400">Create New Family</span>
            </button>
          </>
        ) : (
          /* Create Family Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Family Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm"
                placeholder="Enter family name"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Saving Per Month (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                <input
                  type="number"
                  value={formData.targetSavingPerMonth === 0 ? '' : formData.targetSavingPerMonth}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    targetSavingPerMonth: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 
                  }))}
                  className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm"
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Family Members
                </label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-colors border border-blue-600/30"
                >
                  <Plus size={14} />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.members.map((member, index) => (
                  <div key={`member-${index}-${member.email || member.name || index}`} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500/50 backdrop-blur-sm"
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
                            className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500/50 backdrop-blur-sm"
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
                              className="w-full pl-3 pr-8 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none backdrop-blur-sm"
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <div className="absolute right-2 top-2">
                              {getRoleIcon(member.role)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(index)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="flex space-x-3 pt-4">
              {families.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl transition-colors backdrop-blur-sm"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded-xl transition-colors backdrop-blur-sm disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Family'}
              </button>
            </div>
          </form>
        )}
    </BottomSheet>
  );
};

export default FamilyModal;
