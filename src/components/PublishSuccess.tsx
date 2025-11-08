import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface PublishSuccessProps {
  onReturnHome: () => void;
}

export default function PublishSuccess({ onReturnHome }: PublishSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Generate confetti particles
  const confettiColors = ['#FF0050', '#00F5FF', '#FFFFFF', '#FFD700'];
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: '-10%',
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: 900,
                opacity: 0,
                rotate: 360,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(0, 245, 255, 0.7)',
                '0 0 0 30px rgba(0, 245, 255, 0)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-full"
          >
            <CheckCircle2 className="w-32 h-32 text-[#00F5FF]" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-white mb-3">
            Video Published Successfully!
          </h2>
          <p className="text-gray-400">
            View it on your profile or share directly.
          </p>
        </motion.div>

        {/* Sparkles decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center space-x-8 mb-12"
        >
          <div className="text-center">
            <motion.p
              className="text-[#FF0050] mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              0
            </motion.p>
            <p className="text-gray-500 text-sm">Views</p>
          </div>
          <div className="text-center">
            <motion.p
              className="text-[#00F5FF] mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            >
              0
            </motion.p>
            <p className="text-gray-500 text-sm">Likes</p>
          </div>
          <div className="text-center">
            <motion.p
              className="text-white mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            >
              0
            </motion.p>
            <p className="text-gray-500 text-sm">Shares</p>
          </div>
        </motion.div>

        {/* Return Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={onReturnHome}
            className="w-full h-12 rounded-xl text-white"
            style={{
              background: 'linear-gradient(135deg, #FF0050 0%, #00F5FF 100%)',
            }}
          >
            Return Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
