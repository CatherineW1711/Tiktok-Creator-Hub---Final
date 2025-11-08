import { motion } from 'motion/react';
import { Music2 } from 'lucide-react';
import { Button } from './ui/button';

interface HomeScreenProps {
  onStartDance: () => void;
}

export default function HomeScreen({ onStartDance }: HomeScreenProps) {
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
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-20"
        >
          <div className="relative mb-6">
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
          <h1 className="text-white text-center mb-2" style={{ fontSize: '20px' }}>
            TikTok Creative Hub
          </h1>
          <p className="text-gray-400 text-center" style={{ fontSize: '14px' }}>
            Dance Mode
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-sm"
        >
          <Button
            onClick={onStartDance}
            className="w-full h-14 rounded-xl text-white"
            style={{
              background: 'linear-gradient(135deg, #FF0050 0%, #00F5FF 100%)',
              boxShadow: '0 4px 30px rgba(255, 0, 80, 0.5)',
              fontSize: '18px',
            }}
          >
            Start Dance Mode
          </Button>
        </motion.div>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-500 mt-8"
          style={{ fontSize: '14px' }}
        >
          Follow the ghost dancer to create perfect moves
        </motion.p>
      </div>
    </div>
  );
}
