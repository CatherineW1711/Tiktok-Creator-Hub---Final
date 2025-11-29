import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoginScreen from './components/LoginScreen';
import DanceMode from './components/DanceMode';
import PublishSuccess from './components/PublishSuccess';
import PublishedTakes, { Take } from './components/PublishedTakes';
import TrainingMode from './screens/TrainingMode';
import PoseCompareMode from './screens/PoseCompareMode';
import ModeBottomNav from './components/ModeBottomNav';

export type Screen = 'login' | 'dance' | 'publishSuccess' | 'publishedTakes' | 'training' | 'poseCompare';
export type Mode = 'dance' | 'train' | 'compare' | 'takes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentMode, setCurrentMode] = useState<Mode>('dance');
  
  // Initialize takes from localStorage
  const [takes, setTakes] = useState<Take[]>(() => {
    const saved = localStorage.getItem('tiktok-takes');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as Take[];
      // Convert stored data URLs back to blob URLs for playback
      return parsed.map(take => ({
        ...take,
        blobUrl: take.blobUrl.startsWith('data:') 
          ? take.blobUrl 
          : take.blobUrl // Already a blob URL or data URL
      }));
    } catch {
      return [];
    }
  });

  // Persist takes to localStorage whenever they change
  useEffect(() => {
    // Store takes with blob URLs (they're already data URLs from recording)
    try {
      localStorage.setItem('tiktok-takes', JSON.stringify(takes));
    } catch (error) {
      console.error('Failed to save takes to localStorage:', error);
      // If storage quota exceeded, try to save without the largest videos
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Some takes may not be saved.');
      }
    }
  }, [takes]);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleModeChange = (mode: Mode) => {
    setCurrentMode(mode);
    switch (mode) {
      case 'dance':
        setCurrentScreen('dance');
        break;
      case 'train':
        setCurrentScreen('training');
        break;
      case 'compare':
        setCurrentScreen('poseCompare');
        break;
      case 'takes':
        setCurrentScreen('publishedTakes');
        break;
    }
  };

  const handleDeleteTake = (takeId: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== takeId));
  };

  // Show bottom nav on main screens (not login or publishSuccess)
  const showBottomNav = !['login', 'publishSuccess'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Mobile Frame - iPhone 16 Pro */}
      <div className="relative w-[402px] h-[874px] bg-black rounded-[48px] overflow-hidden shadow-2xl border-4 border-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {currentScreen === 'login' && (
              <LoginScreen 
                onLogin={() => navigateTo('dance')} 
                onViewTakes={() => navigateTo('publishedTakes')}
              />
            )}
            {currentScreen === 'dance' && (
              <DanceMode 
                onBack={() => navigateTo('login')} 
                onPublish={() => navigateTo('publishSuccess')}
                onViewTakes={() => navigateTo('publishedTakes')}
                takes={takes}
                setTakes={setTakes}
              />
            )}
            {currentScreen === 'publishSuccess' && (
              <PublishSuccess onReturnHome={() => navigateTo('login')} />
            )}
            {currentScreen === 'publishedTakes' && (
              <PublishedTakes 
                takes={takes}
                onBack={() => navigateTo('login')}
                onDeleteTake={handleDeleteTake}
              />
            )}
            {currentScreen === 'training' && (
              <TrainingMode
                onBack={() => navigateTo('login')}
                takes={takes}
                setTakes={setTakes}
              />
            )}
            {currentScreen === 'poseCompare' && (
              <PoseCompareMode onBack={() => navigateTo('login')} />
            )}
          </motion.div>
        </AnimatePresence>
        {showBottomNav && (
          <ModeBottomNav
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
        )}
      </div>
    </div>
  );
}
