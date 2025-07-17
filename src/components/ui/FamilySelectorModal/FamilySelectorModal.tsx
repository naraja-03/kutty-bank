'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, Crown } from 'lucide-react';
import { RootState } from '@/store';
import { useGetFamiliesQuery } from '@/store/api/familyApi';
import ListModal from '../ListModal';
import { FamilySelectorModalProps, FamilyOption } from './types';

export default function FamilySelectorModal({
  isOpen,
  onClose,
  onSelectFamily,
  onCreateFamily
}: FamilySelectorModalProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [families, setFamilies] = useState<FamilyOption[]>([]);
  

  const { data: userFamilies = [], isLoading } = useGetFamiliesQuery(
    user?.id || '',
    { skip: !user?.id }
  );

  useEffect(() => {
    if (userFamilies) {
      const familyOptions: FamilyOption[] = userFamilies.map((family: { id: string; name: string; members?: unknown[] }) => ({
        id: family.id,
        name: family.name,
        memberCount: family.members?.length || 0,
        isActive: family.id === user?.familyId
      }));
      setFamilies(familyOptions);
    }
  }, [userFamilies, user?.familyId]);

  const handleSelectFamily = (familyId: string) => {
    onSelectFamily(familyId);
    onClose();
  };

  const handleCreateNew = () => {


    onClose();
    if (onCreateFamily) {

      console.log('Create new family functionality not implemented yet');
    }
  };

  const listItems = families.map(family => ({
    id: family.id,
    label: family.name,
    subtitle: `${family.memberCount} member${family.memberCount !== 1 ? 's' : ''}`,
    icon: family.isActive ? (
      <Crown className="w-5 h-5 text-yellow-400" />
    ) : (
      <Users className="w-5 h-5 text-white/70" />
    ),
    disabled: false
  }));

  return (
    <ListModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={(item) => handleSelectFamily(item.id)}
      title="Switch Family"
      subtitle="Select a family to manage"
      items={listItems}
      selectedId={user?.familyId}
      showCreateNew={true}
      onCreateNew={handleCreateNew}
      createNewText="Create New Family"
      emptyText="No families found"
      isLoading={isLoading}
    />
  );
}
