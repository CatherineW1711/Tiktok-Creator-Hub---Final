import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoginScreen from './components/LoginScreen';
import DanceMode from './components/DanceMode';
import PublishSuccess from './components/PublishSuccess';

export type Screen = 'login' | 'dance' | 'publishSuccess';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

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
              <LoginScreen onLogin={() => navigateTo('dance')} />
            )}
            {currentScreen === 'dance' && (
              <DanceMode 
                onBack={() => navigateTo('login')} 
                onPublish={() => navigateTo('publishSuccess')}
              />
            )}
            {currentScreen === 'publishSuccess' && (
              <PublishSuccess onReturnHome={() => navigateTo('login')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
