import { useState, useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import BottomNav from './BottomNav';

interface ModeSelectorProps {
  onSelectMode: (mode: 'dance' | 'teach' | 'rolePlay') => void;
  onNavigate: (screen: string) => void;
}

export default function ModeSelector({ onSelectMode, onNavigate }: ModeSelectorProps) {
  const [selectedSegment, setSelectedSegment] = useState<'dance' | 'teach' | 'rolePlay'>('dance');
  const [rotation, setRotation] = useState(0);
  const centerRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: 'teach' as const, label: 'Teach', angle: -90, color: '#00F5FF' },
    { id: 'rolePlay' as const, label: 'Role Play', angle: 0, color: '#A855F7' },
    { id: 'dance' as const, label: 'Dance', angle: 90, color: '#FF0050' },
  ];

  const getModeFromAngle = (angle: number): 'dance' | 'teach' | 'rolePlay' => {
    // Normalize angle to 0-360
    const normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Map angles to modes
    if (normalizedAngle >= 330 || normalizedAngle < 90) {
      return 'dance';
    } else if (normalizedAngle >= 90 && normalizedAngle < 210) {
      return 'rolePlay';
    } else {
      return 'teach';
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!centerRef.current) return;

    const rect = centerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Get pointer position
    const clientX = 'clientX' in event ? event.clientX : ('touches' in event ? event.touches[0].clientX : 0);
    const clientY = 'clientY' in event ? event.clientY : ('touches' in event ? event.touches[0].clientY : 0);

    // Calculate angle from center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    setRotation(angle);
    const newMode = getModeFromAngle(angle);
    if (newMode !== selectedSegment) {
      setSelectedSegment(newMode);
    }
  };

  const handleSegmentClick = (mode: 'dance' | 'teach' | 'rolePlay') => {
    setSelectedSegment(mode);
    // Animate rotation to match selected mode
    const modeData = modes.find(m => m.id === mode);
    if (modeData) {
      setRotation(modeData.angle);
    }
  };

  const handleStart = () => {
    onSelectMode(selectedSegment);
  };

  const getStartButtonColor = () => {
    switch (selectedSegment) {
      case 'dance':
        return 'linear-gradient(135deg, #FF0050 0%, #FF3380 100%)';
      case 'teach':
        return 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)';
      case 'rolePlay':
        return 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)';
    }
  };

  const getStartButtonShadow = () => {
    switch (selectedSegment) {
      case 'dance':
        return ['0 0 20px rgba(255, 0, 80, 0.5)', '0 0 30px rgba(255, 0, 80, 0.7)', '0 0 20px rgba(255, 0, 80, 0.5)'];
      case 'teach':
        return ['0 0 20px rgba(0, 245, 255, 0.5)', '0 0 30px rgba(0, 245, 255, 0.7)', '0 0 20px rgba(0, 245, 255, 0.5)'];
      case 'rolePlay':
        return ['0 0 20px rgba(168, 85, 247, 0.5)', '0 0 30px rgba(168, 85, 247, 0.7)', '0 0 20px rgba(168, 85, 247, 0.5)'];
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="pt-12 pb-4 px-6">
        <h2 className="text-white text-center">Creative Hub</h2>
        <p className="text-gray-500 text-center text-sm mt-1">Choose your mode</p>
      </div>

      {/* Circular Mode Selector */}
      <div className="flex items-center justify-center" style={{ height: 'calc(100% - 180px)' }}>
        <div className="relative w-72 h-72" ref={centerRef}>
          {/* Draggable Outer Ring */}
          <motion.svg 
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
          >
            <g transform="rotate(-90 144 144)">
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="40"
              />
              
              {/* Mode Segments */}
              {modes.map((mode, index) => {
                const isSelected = selectedSegment === mode.id;
                const segmentAngle = 120;
                const startAngle = index * 120;
                const radius = 130;
                const circumference = 2 * Math.PI * radius;
                const segmentLength = (segmentAngle / 360) * circumference;
                const offset = (startAngle / 360) * circumference;

                return (
                  <motion.circle
                    key={mode.id}
                    cx="144"
                    cy="144"
                    r={radius}
                    fill="none"
                    stroke={isSelected ? mode.color : '#333'}
                    strokeWidth="40"
                    strokeDasharray={`${segmentLength} ${circumference}`}
                    strokeDashoffset={-offset}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleSegmentClick(mode.id)}
                    animate={{
                      stroke: isSelected ? [mode.color, '#FFFFFF', mode.color] : '#333',
                      strokeWidth: isSelected ? [40, 45, 40] : 40,
                    }}
                    transition={isSelected ? { duration: 2, repeat: Infinity } : {}}
                  />
                );
              })}
            </g>
          </motion.svg>

          {/* Mode Labels - Static */}
          {modes.map((mode) => {
            const angle = mode.angle * (Math.PI / 180);
            const labelRadius = 160;
            const x = 144 + labelRadius * Math.cos(angle);
            const y = 144 + labelRadius * Math.sin(angle);
            const isSelected = selectedSegment === mode.id;

            return (
              <motion.div
                key={mode.id}
                className="absolute cursor-pointer select-none"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleSegmentClick(mode.id)}
                animate={{
                  scale: isSelected ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    textShadow: isSelected 
                      ? `0 0 10px ${mode.color}` 
                      : 'none',
                  }}
                >
                  <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {mode.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Center Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="w-32 h-32 rounded-full bg-[#121212] border-2 flex flex-col items-center justify-center"
              animate={{
                borderColor: modes.find(m => m.id === selectedSegment)?.color,
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <p className="text-gray-400 text-xs">TikTok</p>
              <motion.p 
                className="uppercase tracking-wider text-sm"
                animate={{
                  color: modes.find(m => m.id === selectedSegment)?.color,
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {selectedSegment}
              </motion.p>
            </motion.div>
          </div>

          {/* Start Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '200px' }}>
            <motion.button
              onClick={handleStart}
              className="px-8 py-3 rounded-full text-white pointer-events-auto"
              style={{
                background: getStartButtonColor(),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                background: getStartButtonColor(),
                boxShadow: getStartButtonShadow(),
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Start
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
