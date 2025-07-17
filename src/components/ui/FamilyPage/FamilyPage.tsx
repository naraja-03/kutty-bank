'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users,
  Plus,
  Crown,
  Shield,
  Eye,
  Settings,
  MoreVertical,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  useGetFamilyQuery,
  useInviteMemberMutation,
  useUpdateBudgetMutation,
  useDeleteFamilyMutation,
} from '../../../store/api/familyApi';
import { FamilyPageProps, InviteFormData } from './types';
import { RootState } from '../../../store';
import { updateUser } from '../../../store/slices/authSlice';
import BottomNav from '../BottomNav';
import FamilySelectorModal from '../FamilySelectorModal';
import ConfirmationModal from '../ConfirmationModal';
import FormModal from '../FormModal';
import { useRouter } from 'next/navigation';
import { useFamilyManager } from '../../../hooks/useFamilyManager';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export default function FamilyPage({ className }: FamilyPageProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showFamilySelector, setShowFamilySelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [inviteData, setInviteData] = useState<InviteFormData>({
    email: '',
    role: 'member',
  });
  const [budgetAmount, setBudgetAmount] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { currentFamily, isLoading: familyManagerLoading, hasValidFamily } = useFamilyManager();

  const {
    data: family,
    isLoading,
    error,
  } = useGetFamilyQuery(currentFamily || '', {
    skip: !currentFamily || !hasValidFamily,
  });

  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [updateBudget, { isLoading: isUpdatingBudget }] = useUpdateBudgetMutation();
  const [deleteFamily, { isLoading: isDeleting }] = useDeleteFamilyMutation();

  const handleInviteSubmit = async (data: Record<string, string | number>) => {
    try {
      await inviteMember({
        email: data.email as string,
        role: data.role as 'admin' | 'member' | 'view-only',
      });
      setInviteData({ email: '', role: 'member' });
      setShowInviteForm(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleInviteFieldChange = (fieldId: string, value: string | number) => {
    setInviteData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleBudgetSubmit = async (data: Record<string, string | number>) => {
    if (!family?.id) return;

    try {
      await updateBudget({
        familyId: family.id,
        budgetCap: data.budgetAmount as number,
      });
      setShowBudgetForm(false);
      setBudgetAmount('');
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleBudgetFieldChange = (fieldId: string, value: string | number) => {
    setBudgetAmount(value.toString());
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={clsx('min-h-screen text-white', className)}>
        <div className="px-4 py-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/95/60 rounded-xl p-4 border border-gray-800 animate-pulse backdrop-blur-sm"
              >
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
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx('min-h-screen text-white', className)}>
        <div className="px-4 py-8 text-center">
          <p className="text-red-400">Error loading family data</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!currentFamily && !familyManagerLoading) {
    return (
      <div className={clsx('min-h-screen text-white', className)}>
        <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <h1 className="text-xl font-bold">Family</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 pb-20">
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Family Found</h2>
            <p className="text-gray-400 mb-6">
              You&apos;re not part of any family yet. Create a new family or join an existing one to
              get started.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen text-white', className)}>
      <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10">
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

      <div className="px-4 py-6 pb-20">
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
                ></button>
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

        <div className="space-y-4">
          <h3 className="font-semibold">Members</h3>
          {family?.members?.map((member, index) => (
            <div
              key={member.id || `member-${index}`}
              className="bg-gray-900/95/60 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
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

        <FormModal
          isOpen={showInviteForm}
          onClose={() => setShowInviteForm(false)}
          onSubmit={handleInviteSubmit}
          title="Invite Family Member"
          subtitle="Add a new member to your family"
          fields={[
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              value: inviteData.email,
              placeholder: 'member@example.com',
              required: true,
            },
            {
              id: 'role',
              label: 'Role',
              type: 'select',
              value: inviteData.role,
              options: [
                { value: 'member', label: 'Member' },
                { value: 'admin', label: 'Admin' },
                { value: 'view-only', label: 'View Only' },
              ],
              required: true,
            },
          ]}
          onFieldChange={handleInviteFieldChange}
          submitText="Send Invite"
          isLoading={isInviting}
        />

        <FormModal
          isOpen={showBudgetForm}
          onClose={() => setShowBudgetForm(false)}
          onSubmit={handleBudgetSubmit}
          title="Set Monthly Budget"
          subtitle="Set a spending limit for your family"
          fields={[
            {
              id: 'budgetAmount',
              label: 'Budget Amount (₹)',
              type: 'number',
              value: budgetAmount ? parseFloat(budgetAmount) : 0,
              placeholder: '50000',
              required: true,
            },
          ]}
          onFieldChange={handleBudgetFieldChange}
          submitText="Update Budget"
          isLoading={isUpdatingBudget}
        />

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteFamily}
          title="Delete Family"
          message={
            <div>
              <p className="mb-4">
                Are you sure you want to delete &quot;{family?.name}&quot;? This action cannot be
                undone and will permanently delete:
              </p>
              <ul className="text-sm space-y-1 text-left">
                <li>• All family members will be removed</li>
                <li>• All transactions will be deleted</li>
                <li>• All budgets will be deleted</li>
                <li>• All family data will be permanently lost</li>
              </ul>
            </div>
          }
          confirmText="Delete Family"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>

      <FamilySelectorModal
        isOpen={showFamilySelector}
        onClose={() => setShowFamilySelector(false)}
        onSelectFamily={(familyId: string) => {
          dispatch(updateUser({ familyId }));
          setShowFamilySelector(false);
        }}
      />

      <BottomNav />
    </div>
  );
}
