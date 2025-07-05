'use client';

import { useState } from 'react';
import { Users, Plus, Crown, Shield, Eye, Settings, MoreVertical, IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useGetFamilyQuery, useInviteMemberMutation, useUpdateBudgetMutation } from '../../../store/api/familyApi';
import { FamilyPageProps, InviteFormData } from './types';

export default function FamilyPage({ className }: FamilyPageProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [inviteData, setInviteData] = useState<InviteFormData>({
    email: '',
    role: 'member'
  });
  const [budgetAmount, setBudgetAmount] = useState('');

  const { data: family, isLoading, error } = useGetFamilyQuery();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [updateBudget, { isLoading: isUpdatingBudget }] = useUpdateBudgetMutation();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteMember(inviteData);
      setInviteData({ email: '', role: 'member' });
      setShowInviteForm(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBudget({ budgetCap: parseFloat(budgetAmount) });
      setShowBudgetForm(false);
      setBudgetAmount('');
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} className="text-yellow-400" />;
      case 'member':
        return <Shield size={16} className="text-blue-400" />;
      case 'view-only':
        return <Eye size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-yellow-400';
      case 'member':
        return 'text-blue-400';
      case 'view-only':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={clsx('min-h-screen bg-black text-white', className)}>
        <div className="px-4 py-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx('min-h-screen bg-black text-white', className)}>
        <div className="px-4 py-8 text-center">
          <p className="text-red-400">Error loading family data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen bg-black text-white', className)}>
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <h1 className="text-xl font-bold">Family</h1>
            </div>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-20">
        {/* Family Info */}
        {family && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{family.name}</h2>
              <span className="text-sm text-gray-400">{family.members.length} members</span>
            </div>
            
            {/* Budget Cap */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Monthly Budget</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {family.budgetCap ? formatCurrency(family.budgetCap) : 'Not set'}
                </span>
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Invite Member</span>
          </button>
          <button
            onClick={() => setShowBudgetForm(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Members</h3>
          {family?.members.map((member) => (
            <div key={member.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {member.profileImage ? (
                    <Image
                      src={member.profileImage}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{member.name}</h4>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-400">{member.email}</p>
                    <p className={clsx('text-xs capitalize', getRoleColor(member.role))}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Form Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Invite Family Member</h3>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="member@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as 'admin' | 'member' | 'view-only' }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="view-only">View Only</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isInviting ? 'Inviting...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budget Form Modal */}
        {showBudgetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Set Monthly Budget</h3>
              <form onSubmit={handleUpdateBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBudgetForm(false)}
                    className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingBudget}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdatingBudget ? 'Updating...' : 'Update Budget'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
