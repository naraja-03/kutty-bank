import { motion } from 'framer-motion';
import Image from 'next/image';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export const Logo = ({ 
  size = 'md', 
  animate = false,
  className = '' 
}: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const LogoImage = () => (
    <Image
      src="/icon-glass.svg"
      alt="RightTrack Logo"
      width={96}
      height={96}
      className={`${sizeClasses[size]} ${className}`}
      priority
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <LogoImage />
      </motion.div>
    );
  }

  return <LogoImage />;
};
