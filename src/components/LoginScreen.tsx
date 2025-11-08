import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleStartDance = () => {
    setKeyboardVisible(false);
    setTimeout(() => onLogin(), 300);
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

      <div className="relative z-10 flex flex-col h-full px-8">
        {/* Logo - Centered when keyboard hidden */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            marginTop: keyboardVisible ? '60px' : 'auto',
            marginBottom: keyboardVisible ? '40px' : 'auto'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col items-center"
          style={{ flexShrink: 0 }}
        >
          {/* Logo Icon */}
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

        {/* Spacer */}
        {!keyboardVisible && <div className="flex-1" />}

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full space-y-4"
          style={{ flexShrink: 0, paddingBottom: keyboardVisible ? '80px' : '120px' }}
        >
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setKeyboardVisible(true)}
              className="w-full bg-[#121212] border-gray-800 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-[#FF0050] transition-colors"
              style={{ fontSize: '14px' }}
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setKeyboardVisible(true)}
              className="w-full bg-[#121212] border-gray-800 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-[#00F5FF] transition-colors"
              style={{ fontSize: '14px' }}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleStartDance}
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

          <p className="text-center text-gray-500 text-sm mt-4 cursor-pointer hover:text-gray-400 transition-colors" style={{ fontSize: '14px' }}>
            Forgot password?
          </p>

          {!keyboardVisible && (
            <p className="text-center text-gray-600 text-xs mt-6" style={{ fontSize: '14px' }}>
              For student creators
            </p>
          )}
        </motion.div>

        {/* Spacer at bottom when keyboard hidden */}
        {!keyboardVisible && <div className="flex-1" />}
      </div>

      {/* Keyboard Animation */}
      <AnimatePresence>
        {keyboardVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 h-72 bg-[#1a1a1a] border-t border-gray-700 shadow-2xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setKeyboardVisible(false);
              }
            }}
          >
            <div className="grid grid-cols-10 gap-1.5 p-3">
              {/* Row 1 */}
              {['Q','W','E','R','T','Y','U','I','O','P'].map((key) => (
                <div
                  key={key}
                  className="h-11 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-white hover:bg-[#3a3a3a] active:bg-[#4a4a4a] transition-colors cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  {key}
                </div>
              ))}
              {/* Row 2 */}
              <div className="col-span-1" />
              {['A','S','D','F','G','H','J','K','L'].map((key) => (
                <div
                  key={key}
                  className="h-11 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-white hover:bg-[#3a3a3a] active:bg-[#4a4a4a] transition-colors cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  {key}
                </div>
              ))}
              {/* Row 3 */}
              <div className="col-span-1" />
              {['Z','X','C','V','B','N','M'].map((key) => (
                <div
                  key={key}
                  className="h-11 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-white hover:bg-[#3a3a3a] active:bg-[#4a4a4a] transition-colors cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  {key}
                </div>
              ))}
              <div className="col-span-2" />
              {/* Space bar */}
              <div className="col-span-1" />
              <div className="col-span-8 h-11 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-white text-sm hover:bg-[#3a3a3a] active:bg-[#4a4a4a] transition-colors cursor-pointer" style={{ fontSize: '14px' }}>
                space
              </div>
              <div className="col-span-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
