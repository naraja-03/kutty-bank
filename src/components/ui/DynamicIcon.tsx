import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 16, 
  color 
}) => {
  // Get the icon component from lucide-react
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];
  
  // Fallback to Tag icon if the requested icon doesn't exist
  const FallbackIcon = LucideIcons.Tag;
  
  const Icon = IconComponent || FallbackIcon;
  
  return (
    <Icon 
      className={className} 
      size={size} 
      color={color}
    />
  );
};

export default DynamicIcon;
