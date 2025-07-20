import { motion } from 'framer-motion';
import { FullPageLoading } from '../Loading';
import { Logo } from '../Logo';

export interface AppLoadingScreenProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  children?: React.ReactNode;
}

export const AppLoadingScreen = ({ 
  message = "Loading...", 
  progress = 0,
  showProgress = false,
  children 
}: AppLoadingScreenProps) => {
  if (children) {
    // Show loading overlay over existing content
    return (
      <div className="relative">
        {children}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Logo size="lg" className="mx-auto" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-white text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {message}
            </motion.p>
            {showProgress && (
              <div className="w-48 h-1 bg-white/10 rounded-full mx-auto mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Full page loading
  return <FullPageLoading message={message} showProgress={showProgress} />;
};
