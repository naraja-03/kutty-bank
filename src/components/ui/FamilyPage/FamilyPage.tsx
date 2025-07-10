'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Plus, Crown, Shield, Eye, Settings, MoreVertical, IndianRupee, ChevronDown, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency, getInitials } from '../../../lib/formatters';
import { useGetFamilyQuery, useInviteMemberMutation, useUpdateBudgetMutation, useDeleteFamilyMutation } from '../../../store/api/familyApi';
import { FamilyPageProps, InviteFormData } from './types';
import { RootState } from '../../../store';
import { updateUser } from '../../../store/slices/authSlice';
import FamilySelectorModal from '../FamilySelectorModal';
import { useRouter } from 'next/navigation';
import { useFamilyManager } from '../../../hooks/useFamilyManager';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../PullToRefreshIndicator';

export default function FamilyPage({ className }: FamilyPageProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showFamilySelector, setShowFamilySelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [inviteData, setInviteData] = useState<InviteFormData>({
    email: '',
    role: 'member'
  });
  const [budgetAmount, setBudgetAmount] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const safeAreaInsets = useSafeArea();
  
  const {
    currentFamily,
    isLoading: familyManagerLoading
  } = useFamilyManager();
  
  const { data: family, isLoading, error, refetch } = useGetFamilyQuery(currentFamily || '', {
    skip: !currentFamily
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const { isRefreshing, pullDistance, isPulling, progress } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    enabled: true
  });
  
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [updateBudget, { isLoading: isUpdatingBudget }] = useUpdateBudgetMutation();
  const [deleteFamily, { isLoading: isDeleting }] = useDeleteFamilyMutation();

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
    if (!family?.id) return;
    
    try {
      await updateBudget({ 
        familyId: family.id,
        budgetCap: parseFloat(budgetAmount) 
      });
      setShowBudgetForm(false);
      setBudgetAmount('');
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleDeleteFamily = async () => {
    if (!family?.id) return;
    
    try {
      await deleteFamily(family.id);
      setShowDeleteConfirm(false);
      
      dispatch(updateUser({ familyId: undefined, role: undefined }));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete family:', error);
    }
  };

  const isCurrentUserAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettingsMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.settings-dropdown')) {
          setShowSettingsMenu(false);
        }
      }
    };

    if (showSettingsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSettingsMenu]);

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

  if (isLoading) {
    return (
      <div className={clsx('min-h-screen text-white', className)}>
        <div className="px-4 py-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900/95/60 rounded-xl p-4 border border-gray-800 animate-pulse backdrop-blur-sm">
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
      <div className={clsx('min-h-screen text-white', className)}>
        <div className="px-4 py-8 text-center">
          <p className="text-red-400">Error loading family data</p>
        </div>
      </div>
    );
  }

  if (!currentFamily && !familyManagerLoading) {
    return (
      <>
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          isPulling={isPulling}
          progress={progress}
        />
        <div className={clsx('min-h-screen text-white', className)}>
        <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10" style={{ paddingTop: safeAreaInsets.top }}>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <h1 className="text-xl font-bold">Family</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 pb-24">
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Family Found</h2>
            <p className="text-gray-400 mb-6">
              You&apos;re not part of any family yet. Create a new family or join an existing one to get started.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        isPulling={isPulling}
        progress={progress}
      />
      <div className={clsx('min-h-screen text-white', className)}>
      <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10" style={{ paddingTop: safeAreaInsets.top }}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <h1 className="text-xl font-bold">Family</h1>
            </div>
            <button
              onClick={() => setShowFamilySelector(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors"
            >
              <span className="text-sm text-blue-400">Switch Family</span>
              <ChevronDown size={16} className="text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {family && (
          <div className="bg-gray-900/95/60 rounded-xl p-4 border border-gray-800/50 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{family.name}</h2>
              <span className="text-sm text-gray-400">{family.members?.length || 0} members</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Monthly Budget</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium m-0">
                  {family.budgetCap ? formatCurrency(family.budgetCap) : 'Not set'}
                </span>
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Invite Member</span>
          </button>
          
          {}
          <div className="relative settings-dropdown">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg font-medium transition-colors"
            >
              <Settings size={16} />
            </button>
            
            {showSettingsMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowBudgetForm(true);
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-700 text-white"
                >
                  Set Budget
                </button>
                
                {isCurrentUserAdmin && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors text-red-400 flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete Family</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="space-y-4">
          <h3 className="font-semibold">Members</h3>
          {family?.members?.map((member, index) => (
            <div key={member.id || `member-${index}`} className="bg-gray-900/95/60 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-950 to-black flex items-center justify-center border border-gray-800">
                    <span className="text-white text-sm font-semibold">
                      {getInitials(member.name || 'U')}
                    </span>
                  </div>
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

        {}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95/80 rounded-xl p-6 w-full max-w-md border border-gray-800/50 backdrop-blur-md">
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

        {}
        {showBudgetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95/80 rounded-xl p-6 w-full max-w-md border border-gray-800/50 backdrop-blur-md">
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

        {}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95/80 rounded-xl p-6 w-full max-w-md border border-gray-800/50 backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Delete Family</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete &quot;{family?.name}&quot;? This action cannot be undone and will permanently delete:
              </p>
              <ul className="text-sm text-gray-400 mb-6 space-y-1">
                <li>• All family members will be removed</li>
                <li>• All transactions will be deleted</li>
                <li>• All budgets will be deleted</li>
                <li>• All family data will be permanently lost</li>
              </ul>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFamily}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete Forever</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {}
      <FamilySelectorModal
        isOpen={showFamilySelector}
        onClose={() => setShowFamilySelector(false)}
        onSelectFamily={(familyId) => {
          dispatch(updateUser({ familyId }));
          setShowFamilySelector(false);
        }}
      />
    </div>
    </>
  );
}
