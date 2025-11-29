import { motion } from 'motion/react';
import { Music2, GraduationCap, Target, Video } from 'lucide-react';

interface ModeBottomNavProps {
  currentMode: 'dance' | 'train' | 'compare' | 'takes';
  onModeChange: (mode: 'dance' | 'train' | 'compare' | 'takes') => void;
}

export default function ModeBottomNav({ currentMode, onModeChange }: ModeBottomNavProps) {
  const modes = [
    { id: 'dance' as const, label: 'Dance', icon: Music2 },
    { id: 'train' as const, label: 'Train', icon: GraduationCap },
    { id: 'compare' as const, label: 'Compare', icon: Target },
    { id: 'takes' as const, label: 'Takes', icon: Video },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors"
            >
              <div
                className={`p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#FF0050] to-[#00F5FF]'
                    : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                />
              </div>
              <span
                className={`text-xs ${
                  isActive ? 'text-white font-semibold' : 'text-gray-500'
                }`}
              >
                {mode.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF0050]"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

