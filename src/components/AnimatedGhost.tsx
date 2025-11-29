import { motion } from 'motion/react';

interface AnimatedGhostProps {
  poseName: string;
  beatActive?: boolean;
  songId?: string; // For song-specific choreography
  className?: string;
}

// Enhanced pose definitions with richer movements
interface PoseConfig {
  // Head & Neck (connected)
  head: { cx: number; cy: number; r: number };
  neck: { x: number; y: number; width: number; height: number; rotation: number };
  
  // Torso (solid shape)
  torso: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    rotation: number;
    skewX?: number; // For body waves
  };
  
  // Arms (with upper/lower segments for more natural movement)
  leftArm: {
    shoulder: { x: number; y: number };
    elbow: { x: number; y: number; rotation: number };
    hand: { x: number; y: number; rotation: number };
    width: number;
  };
  rightArm: {
    shoulder: { x: number; y: number };
    elbow: { x: number; y: number; rotation: number };
    hand: { x: number; y: number; rotation: number };
    width: number;
  };
  
  // Legs (with upper/lower segments)
  leftLeg: {
    hip: { x: number; y: number };
    knee: { x: number; y: number; rotation: number };
    foot: { x: number; y: number; rotation: number };
    width: number;
  };
  rightLeg: {
    hip: { x: number; y: number };
    knee: { x: number; y: number; rotation: number };
    foot: { x: number; y: number; rotation: number };
    width: number;
  };
  
  // Body position
  bodyX?: number; // Side step
  bodyY?: number; // Jump/bounce
  bodyScale?: number;
  bodyRotation?: number; // Torso twist
}

// Song-specific choreography patterns
const choreographyPatterns: Record<string, string[]> = {
  greedy: ['Neutral', 'Arm Wave', 'Side Step', 'Body Wave', 'Arm Cross', 'Jump Pose'],
  woman: ['Neutral', 'Hip Sway', 'Arm Flow', 'Torso Twist', 'Leg Lift', 'Arm Wave'],
  trend1: ['Neutral', 'Arm Wave', 'Side Step', 'Body Wave', 'Jump Pose', 'Arm Cross'],
  renai: ['Neutral', 'Gentle Sway', 'Arm Flow', 'Hip Sway', 'Body Wave', 'Torso Twist'], // Different pattern for Renai
};

// Rich pose configurations
const poseConfigs: Record<string, PoseConfig> = {
  'Neutral': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 120, y: 175, rotation: 20 },
      hand: { x: 110, y: 200, rotation: 10 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 180, y: 175, rotation: -20 },
      hand: { x: 190, y: 200, rotation: -10 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 260, rotation: -5 },
      foot: { x: 170, y: 300, rotation: 0 },
      width: 9,
    },
    bodyScale: 1,
  },
  'Arm Wave': {
    head: { cx: 150, cy: 95, r: 22 },
    neck: { x: 150, y: 117, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 135, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 140 },
      elbow: { x: 100, y: 130, rotation: -70 },
      hand: { x: 85, y: 120, rotation: -20 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 140 },
      elbow: { x: 200, y: 130, rotation: 70 },
      hand: { x: 215, y: 120, rotation: 20 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 205 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 205 },
      knee: { x: 165, y: 260, rotation: -5 },
      foot: { x: 170, y: 300, rotation: 0 },
      width: 9,
    },
    bodyScale: 1.05,
  },
  'Side Step': {
    head: { cx: 160, cy: 100, r: 22 },
    neck: { x: 160, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 160, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 145, y: 145 },
      elbow: { x: 130, y: 175, rotation: 30 },
      hand: { x: 120, y: 200, rotation: 15 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 175, y: 145 },
      elbow: { x: 190, y: 175, rotation: -30 },
      hand: { x: 200, y: 200, rotation: -15 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 150, y: 210 },
      knee: { x: 140, y: 260, rotation: 15 },
      foot: { x: 125, y: 300, rotation: 10 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 170, y: 210 },
      knee: { x: 180, y: 260, rotation: -15 },
      foot: { x: 195, y: 300, rotation: -10 },
      width: 9,
    },
    bodyX: 10,
    bodyScale: 1,
  },
  'Body Wave': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0, skewX: 8 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 125, y: 170, rotation: 40 },
      hand: { x: 120, y: 195, rotation: 20 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 175, y: 170, rotation: -40 },
      hand: { x: 180, y: 195, rotation: -20 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 10 },
      foot: { x: 130, y: 300, rotation: 5 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 260, rotation: -10 },
      foot: { x: 170, y: 300, rotation: -5 },
      width: 9,
    },
    bodyScale: 1.02,
  },
  'Hip Sway': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 5 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 120, y: 175, rotation: 25 },
      hand: { x: 110, y: 200, rotation: 15 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 180, y: 175, rotation: -25 },
      hand: { x: 190, y: 200, rotation: -15 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 145, y: 210 },
      knee: { x: 140, y: 260, rotation: 10 },
      foot: { x: 135, y: 300, rotation: 5 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 155, y: 210 },
      knee: { x: 160, y: 260, rotation: -10 },
      foot: { x: 165, y: 300, rotation: -5 },
      width: 9,
    },
    bodyRotation: 5,
    bodyScale: 1,
  },
  'Torso Twist': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 15 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 155, y: 175, rotation: -30 },
      hand: { x: 170, y: 200, rotation: -20 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 145, y: 175, rotation: 30 },
      hand: { x: 130, y: 200, rotation: 20 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 260, rotation: -5 },
      foot: { x: 170, y: 300, rotation: 0 },
      width: 9,
    },
    bodyRotation: 15,
    bodyScale: 1,
  },
  'Arm Flow': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 110, y: 160, rotation: -50 },
      hand: { x: 95, y: 175, rotation: -30 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 190, y: 160, rotation: 50 },
      hand: { x: 205, y: 175, rotation: 30 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 260, rotation: -5 },
      foot: { x: 170, y: 300, rotation: 0 },
      width: 9,
    },
    bodyScale: 1.03,
  },
  'Gentle Sway': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 3 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 125, y: 175, rotation: 15 },
      hand: { x: 118, y: 200, rotation: 8 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 175, y: 175, rotation: -15 },
      hand: { x: 182, y: 200, rotation: -8 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 138, y: 260, rotation: 3 },
      foot: { x: 135, y: 300, rotation: 2 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 162, y: 260, rotation: -3 },
      foot: { x: 165, y: 300, rotation: -2 },
      width: 9,
    },
    bodyRotation: 3,
    bodyScale: 1,
  },
  'Arm Cross': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 170, y: 165, rotation: 50 },
      hand: { x: 190, y: 180, rotation: 30 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 130, y: 165, rotation: -50 },
      hand: { x: 110, y: 180, rotation: -30 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 260, rotation: -5 },
      foot: { x: 170, y: 300, rotation: 0 },
      width: 9,
    },
    bodyScale: 1,
  },
  'Leg Lift': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 125, y: 175, rotation: 20 },
      hand: { x: 118, y: 200, rotation: 10 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 175, y: 175, rotation: -20 },
      hand: { x: 182, y: 200, rotation: -10 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 140, y: 210 },
      knee: { x: 135, y: 260, rotation: 5 },
      foot: { x: 130, y: 300, rotation: 0 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 160, y: 210 },
      knee: { x: 165, y: 240, rotation: -60 },
      foot: { x: 170, y: 220, rotation: -45 },
      width: 9,
    },
    bodyScale: 1.02,
  },
  'Jump Pose': {
    head: { cx: 150, cy: 85, r: 24 },
    neck: { x: 150, y: 109, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 127, width: 38, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 132 },
      elbow: { x: 110, y: 145, rotation: -70 },
      hand: { x: 95, y: 155, rotation: -40 },
      width: 9,
    },
    rightArm: {
      shoulder: { x: 165, y: 132 },
      elbow: { x: 190, y: 145, rotation: 70 },
      hand: { x: 205, y: 155, rotation: 40 },
      width: 9,
    },
    leftLeg: {
      hip: { x: 140, y: 197 },
      knee: { x: 145, y: 250, rotation: 20 },
      foot: { x: 150, y: 290, rotation: 10 },
      width: 10,
    },
    rightLeg: {
      hip: { x: 160, y: 197 },
      knee: { x: 155, y: 250, rotation: -20 },
      foot: { x: 150, y: 290, rotation: -10 },
      width: 10,
    },
    bodyY: -15,
    bodyScale: 1.15,
  },
};

export default function AnimatedGhost({ 
  poseName, 
  beatActive = false, 
  songId,
  className = '' 
}: AnimatedGhostProps) {
  const config = poseConfigs[poseName] || poseConfigs['Neutral'];
  
  // Calculate points with rotation
  const rotatePoint = (x: number, y: number, centerX: number, centerY: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = x - centerX;
    const dy = y - centerY;
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos,
    };
  };

  const bodyX = config.bodyX || 0;
  const bodyY = config.bodyY || 0;
  const bodyRotation = config.bodyRotation || 0;

  // Glow intensity
  const glowIntensity = beatActive ? 1.8 : 1;
  const strokeWidth = beatActive ? 4 : 3;

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {/* Outer glow - contained within bounds */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 245, 255, 0.5) 0%, rgba(255, 0, 80, 0.3) 50%, transparent 70%)',
          filter: 'blur(30px)',
          top: '10%', // Start glow below top to prevent overflow
          bottom: '10%',
          left: '10%',
          right: '10%',
        }}
        animate={{
          opacity: beatActive ? [0.7, 1, 0.7] : [0.5, 0.6, 0.5],
          scale: beatActive ? [1, 1.15, 1] : [1, 1.03, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
      />

      {/* Main ghost */}
      <motion.svg
        viewBox="0 0 300 350"
        className="w-full h-full relative z-10"
        style={{
          filter: `drop-shadow(0 0 ${18 * glowIntensity}px rgba(0, 245, 255, 1)) drop-shadow(0 0 ${35 * glowIntensity}px rgba(255, 0, 80, 0.6))`,
        }}
        clipPath="inset(0 0 0 0)"
        animate={{
          x: bodyX,
          y: bodyY,
          scale: config.bodyScale || 1,
          rotate: bodyRotation,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        {/* Head - connected to neck */}
        <motion.ellipse
          cx={config.head.cx}
          cy={config.head.cy}
          rx={config.head.r}
          ry={config.head.r * 0.9}
          fill="rgba(0, 245, 255, 0.4)"
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          animate={{
            cy: config.head.cy + (beatActive ? [-3, 3, -3] : [0, 1.5, 0]),
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Neck - connects head to torso */}
        <motion.rect
          x={config.neck.x - config.neck.width / 2}
          y={config.neck.y}
          width={config.neck.width}
          height={config.neck.height}
          fill="rgba(0, 245, 255, 0.35)"
          stroke="#00F5FF"
          strokeWidth={strokeWidth - 1}
          rx={config.neck.width / 2}
          transform={`rotate(${config.neck.rotation} ${config.neck.x} ${config.neck.y})`}
        />

        {/* Torso - solid shape */}
        <motion.ellipse
          cx={config.torso.x}
          cy={config.torso.y + config.torso.height / 2}
          rx={config.torso.width / 2}
          ry={config.torso.height / 2}
          fill="rgba(0, 245, 255, 0.35)"
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          transform={`rotate(${config.torso.rotation} ${config.torso.x} ${config.torso.y + config.torso.height / 2}) ${config.torso.skewX ? `skewX(${config.torso.skewX})` : ''}`}
          animate={{
            rx: beatActive ? [config.torso.width / 2, config.torso.width / 2 + 2, config.torso.width / 2] : [config.torso.width / 2, config.torso.width / 2 + 0.5, config.torso.width / 2],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />

        {/* Left Arm - upper segment */}
        <motion.line
          x1={config.leftArm.shoulder.x}
          y1={config.leftArm.shoulder.y}
          x2={config.leftArm.elbow.x}
          y2={config.leftArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={config.leftArm.width}
          strokeLinecap="round"
          fill="rgba(0, 245, 255, 0.3)"
          animate={{
            x2: [config.leftArm.elbow.x, config.leftArm.elbow.x + (beatActive ? 8 : 2), config.leftArm.elbow.x],
            y2: [config.leftArm.elbow.y, config.leftArm.elbow.y + (beatActive ? -5 : -1), config.leftArm.elbow.y],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Left Arm - lower segment */}
        <motion.line
          x1={config.leftArm.elbow.x}
          y1={config.leftArm.elbow.y}
          x2={config.leftArm.hand.x}
          y2={config.leftArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={config.leftArm.width - 1}
          strokeLinecap="round"
          animate={{
            x2: [config.leftArm.hand.x, config.leftArm.hand.x + (beatActive ? 5 : 1), config.leftArm.hand.x],
            y2: [config.leftArm.hand.y, config.leftArm.hand.y + (beatActive ? -3 : -0.5), config.leftArm.hand.y],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Right Arm - upper segment */}
        <motion.line
          x1={config.rightArm.shoulder.x}
          y1={config.rightArm.shoulder.y}
          x2={config.rightArm.elbow.x}
          y2={config.rightArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={config.rightArm.width}
          strokeLinecap="round"
          animate={{
            x2: [config.rightArm.elbow.x, config.rightArm.elbow.x + (beatActive ? -8 : -2), config.rightArm.elbow.x],
            y2: [config.rightArm.elbow.y, config.rightArm.elbow.y + (beatActive ? -5 : -1), config.rightArm.elbow.y],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Right Arm - lower segment */}
        <motion.line
          x1={config.rightArm.elbow.x}
          y1={config.rightArm.elbow.y}
          x2={config.rightArm.hand.x}
          y2={config.rightArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={config.rightArm.width - 1}
          strokeLinecap="round"
          animate={{
            x2: [config.rightArm.hand.x, config.rightArm.hand.x + (beatActive ? -5 : -1), config.rightArm.hand.x],
            y2: [config.rightArm.hand.y, config.rightArm.hand.y + (beatActive ? -3 : -0.5), config.rightArm.hand.y],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Left Leg - upper segment */}
        <motion.line
          x1={config.leftLeg.hip.x}
          y1={config.leftLeg.hip.y}
          x2={config.leftLeg.knee.x}
          y2={config.leftLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={config.leftLeg.width}
          strokeLinecap="round"
          animate={{
            x2: [config.leftLeg.knee.x, config.leftLeg.knee.x + (beatActive ? 3 : 1), config.leftLeg.knee.x],
            y2: [config.leftLeg.knee.y, config.leftLeg.knee.y + (beatActive ? 4 : 1), config.leftLeg.knee.y],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Left Leg - lower segment */}
        <motion.line
          x1={config.leftLeg.knee.x}
          y1={config.leftLeg.knee.y}
          x2={config.leftLeg.foot.x}
          y2={config.leftLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={config.leftLeg.width - 1}
          strokeLinecap="round"
        />

        {/* Right Leg - upper segment */}
        <motion.line
          x1={config.rightLeg.hip.x}
          y1={config.rightLeg.hip.y}
          x2={config.rightLeg.knee.x}
          y2={config.rightLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={config.rightLeg.width}
          strokeLinecap="round"
          animate={{
            x2: [config.rightLeg.knee.x, config.rightLeg.knee.x + (beatActive ? -3 : -1), config.rightLeg.knee.x],
            y2: [config.rightLeg.knee.y, config.rightLeg.knee.y + (beatActive ? 4 : 1), config.rightLeg.knee.y],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Right Leg - lower segment */}
        <motion.line
          x1={config.rightLeg.knee.x}
          y1={config.rightLeg.knee.y}
          x2={config.rightLeg.foot.x}
          y2={config.rightLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={config.rightLeg.width - 1}
          strokeLinecap="round"
        />

        {/* Joint highlights */}
        {[config.leftArm.shoulder, config.rightArm.shoulder, config.leftLeg.hip, config.rightLeg.hip].map((joint, i) => (
          <motion.circle
            key={i}
            cx={joint.x}
            cy={joint.y}
            r={5}
            fill="rgba(0, 245, 255, 0.7)"
            animate={{
              r: beatActive ? [5, 7, 5] : [5, 5.5, 5],
              opacity: beatActive ? [0.9, 1, 0.9] : [0.7, 0.8, 0.7],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}

// Export function to get choreography pattern for a song
export function getChoreographyPattern(songId: string): string[] {
  return choreographyPatterns[songId] || choreographyPatterns.greedy;
}
