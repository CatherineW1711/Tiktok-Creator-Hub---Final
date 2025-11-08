import { Home, FolderOpen, Video, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  active: 'home' | 'drafts' | 'record' | 'profile';
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home', screen: 'modeSelector' },
    { id: 'drafts' as const, icon: FolderOpen, label: 'Drafts', screen: 'drafts' },
    { id: 'record' as const, icon: Video, label: 'Record', screen: 'modeSelector' },
    { id: 'profile' as const, icon: User, label: 'Profile', screen: 'modeSelector' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#121212] border-t border-gray-900">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center justify-center space-y-1 flex-1"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-[#FF0050]' : 'text-gray-500'}`}
                strokeWidth={1.5}
              />
              <span className={`text-xs ${isActive ? 'text-[#FF0050]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
