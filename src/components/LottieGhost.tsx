import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Lottie from 'lottie-react';

interface LottieGhostProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export default function LottieGhost({
  animationPath,
  className = '',
  loop = true,
  speed = 1,
  onComplete,
}: LottieGhostProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Try to load animation, fallback to null if fails
    fetch(animationPath)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Animation not found');
      })
      .then(data => setAnimationData(data))
      .catch(() => {
        // If animation file doesn't exist, use null (will show fallback)
        setAnimationData(null);
      });
  }, [animationPath]);

  if (!animationData) {
    // Fallback: return a simple animated placeholder
    return (
      <div className={`relative ${className}`}>
        <div 
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.6) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.8))',
          }}
        >
          {/* Placeholder stick figure */}
          <svg viewBox="0 0 300 350" className="w-full h-full">
            <circle cx="150" cy="120" r="18" fill="none" stroke="#00F5FF" strokeWidth="2.5" />
            <line x1="150" y1="138" x2="150" y2="200" stroke="#00F5FF" strokeWidth="2.5" />
            <line x1="150" y1="150" x2="120" y2="190" stroke="#00F5FF" strokeWidth="2.5" />
            <line x1="150" y1="150" x2="180" y2="190" stroke="#00F5FF" strokeWidth="2.5" />
            <line x1="150" y1="200" x2="130" y2="280" stroke="#00F5FF" strokeWidth="2.5" />
            <line x1="150" y1="200" x2="170" y2="280" stroke="#00F5FF" strokeWidth="2.5" />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.6) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Lottie animation */}
      <div 
        className="relative z-10"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.8)) drop-shadow(0 0 40px rgba(0, 245, 255, 0.4))',
        }}
      >
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay
          speed={speed}
          onComplete={onComplete}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

