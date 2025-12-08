import { motion } from 'motion/react';
import { Music2 } from 'lucide-react';
import { Button } from './ui/button';

interface LoginScreenProps {
  onLogin: () => void;
  onViewTakes: () => void;
}

export default function LoginScreen({ onLogin, onViewTakes }: LoginScreenProps) {
  const handleStartDance = () => {
    onLogin();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a0a1a 50%, #000000 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-8 justify-center items-center">
        {/* Logo - Top spacing: 40-60px from safe area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
          style={{ marginTop: '50px', marginBottom: '24px' }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255, 0, 80, 0.6)',
                  '0 0 50px rgba(0, 245, 255, 0.8)',
                  '0 0 30px rgba(255, 0, 80, 0.6)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Music2 
              className="w-24 h-24 relative z-10" 
              strokeWidth={1.5}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 0, 80, 0.8))',
                color: 'white',
              }}
            />
          </div>
          {/* Title - Logo → Title: 24px */}
          <h1 
            className="text-white text-center font-medium"
            style={{ 
              fontSize: '26px',
              marginTop: '24px',
              marginBottom: '10px',
            }}
          >
            TikTok Creative Hub
          </h1>
          {/* Subtitle - Title → Subtitle: 8-10px */}
          <p 
            className="text-gray-400 text-center"
            style={{ 
              fontSize: '15px',
              marginBottom: '36px',
            }}
          >
            Dance Mode
          </p>
        </motion.div>

        {/* Buttons - Subtitle → Primary Button: 32-40px */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm"
          style={{ marginTop: '36px' }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginBottom: '18px' }}
          >
            <Button
              onClick={handleStartDance}
              className="w-full h-14 rounded-xl text-white"
              style={{
                background: 'linear-gradient(135deg, #FF0050 0%, #00F5FF 100%)',
                boxShadow: '0 4px 30px rgba(255, 0, 80, 0.5)',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              Start Dance Mode
            </Button>
          </motion.div>

          {/* Primary → Secondary: 16-20px */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onViewTakes}
              className="w-full h-14 rounded-xl text-white bg-[#121212] border-2 border-gray-700 hover:border-[#00F5FF] transition-colors"
              style={{
                fontSize: '18px',
                fontWeight: 500,
              }}
                >
              View Published Takes
            </Button>
          </motion.div>
        </motion.div>

        {/* Info text - Secondary → Bottom text: 28-32px */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-500"
          style={{ 
            fontSize: '14px',
            marginTop: '30px',
            paddingBottom: '40px',
            color: 'rgba(156, 163, 175, 0.7)',
          }}
        >
          Follow the ghost dancer to create perfect moves
        </motion.p>
      </div>
    </div>
  );
}
