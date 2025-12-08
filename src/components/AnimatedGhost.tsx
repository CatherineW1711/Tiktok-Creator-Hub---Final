import { motion } from 'motion/react';
import { choreographyPatterns } from '../utils/choreography';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface AnimatedGhostProps {
  poseName: string;
  beatActive?: boolean;
  songId?: string;
  difficulty?: DifficultyLevel;
  className?: string;
}

// Enhanced pose definitions with richer movements
interface PoseConfig {
  head: { cx: number; cy: number; r: number };
  neck: { x: number; y: number; width: number; height: number; rotation: number };
  torso: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    rotation: number;
    skewX?: number;
  };
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
  bodyRotation?: number;
  bodyScale?: number;
  bodyX?: number;
  bodyY?: number;
}

const poseConfigs: Record<string, PoseConfig> = {
  'Neutral': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 120, y: 175, rotation: 15 },
      hand: { x: 110, y: 200, rotation: 10 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 180, y: 175, rotation: -15 },
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
      elbow: { x: 100, y: 120, rotation: -70 },
      hand: { x: 85, y: 100, rotation: -40 },
      width: 9,
    },
    rightArm: {
      shoulder: { x: 165, y: 140 },
      elbow: { x: 200, y: 120, rotation: 70 },
      hand: { x: 215, y: 100, rotation: 40 },
      width: 9,
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
    torso: { x: 160, y: 140, width: 35, height: 70, rotation: 5 },
    leftArm: {
      shoulder: { x: 145, y: 145 },
      elbow: { x: 130, y: 175, rotation: 20 },
      hand: { x: 120, y: 200, rotation: 15 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 175, y: 145 },
      elbow: { x: 190, y: 175, rotation: -20 },
      hand: { x: 200, y: 200, rotation: -15 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 150, y: 210 },
      knee: { x: 140, y: 260, rotation: 10 },
      foot: { x: 125, y: 300, rotation: 5 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 170, y: 210 },
      knee: { x: 180, y: 260, rotation: -10 },
      foot: { x: 195, y: 300, rotation: -5 },
      width: 9,
    },
    bodyX: 10,
    bodyScale: 1,
  },
  'Body Wave': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0, skewX: 5 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 125, y: 175, rotation: 10 },
      hand: { x: 118, y: 200, rotation: 5 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 175, y: 175, rotation: -10 },
      hand: { x: 182, y: 200, rotation: -5 },
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
  'Hip Sway': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: -8 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 125, y: 175, rotation: 15 },
      hand: { x: 118, y: 200, rotation: 10 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 175, y: 175, rotation: -15 },
      hand: { x: 182, y: 200, rotation: -10 },
      width: 8,
    },
    leftLeg: {
      hip: { x: 145, y: 210 },
      knee: { x: 150, y: 260, rotation: -5 },
      foot: { x: 155, y: 300, rotation: -3 },
      width: 9,
    },
    rightLeg: {
      hip: { x: 155, y: 210 },
      knee: { x: 150, y: 260, rotation: 5 },
      foot: { x: 145, y: 300, rotation: 3 },
      width: 9,
    },
    bodyRotation: -8,
    bodyScale: 1,
  },
  'Arm Flow': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: 0 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 140, y: 160, rotation: -30 },
      hand: { x: 150, y: 175, rotation: -20 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 160, y: 160, rotation: 30 },
      hand: { x: 150, y: 175, rotation: 20 },
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
  'Gentle Sway': {
    head: { cx: 150, cy: 100, r: 22 },
    neck: { x: 150, y: 122, width: 12, height: 15, rotation: 0 },
    torso: { x: 150, y: 140, width: 35, height: 70, rotation: -5 },
    leftArm: {
      shoulder: { x: 135, y: 145 },
      elbow: { x: 130, y: 175, rotation: 10 },
      hand: { x: 128, y: 200, rotation: 5 },
      width: 8,
    },
    rightArm: {
      shoulder: { x: 165, y: 145 },
      elbow: { x: 170, y: 175, rotation: -10 },
      hand: { x: 172, y: 200, rotation: -5 },
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
    bodyRotation: -5,
    bodyScale: 1,
  },
};

export function getChoreographyPattern(songId: string): string[] {
  return choreographyPatterns[songId] || choreographyPatterns.greedy;
}

export default function AnimatedGhost({ 
  poseName, 
  beatActive = false, 
  songId,
  difficulty = 'medium',
  className = '' 
}: AnimatedGhostProps) {
  const config = poseConfigs[poseName] || poseConfigs['Neutral'];
  
  // Get movement range multiplier based on difficulty
  // Easy: reduce movement range significantly (50% of original)
  // Medium: moderate movement range (85% of original)
  // Hard: enhanced movement range (120% of original) - maximum range for challenge
  const getMovementRangeMultiplier = () => {
    switch (difficulty) {
      case 'easy':
        return 0.5; // Significantly reduced range for beginners
      case 'medium':
        return 0.85; // Moderate range
      case 'hard':
        return 1.2; // Enhanced range (120%) - maximum movement for maximum challenge
      default:
        return 1.0;
    }
  };

  const movementRangeMultiplier = getMovementRangeMultiplier();
  
  // Apply movement range reduction for Easy/Medium modes
  // But ensure movements are still clearly visible - minimum thresholds
  const baseBodyX = (config.bodyX || 0) * movementRangeMultiplier;
  const baseBodyY = (config.bodyY || 0) * movementRangeMultiplier;
  const baseBodyRotation = (config.bodyRotation || 0) * movementRangeMultiplier;
  
  // Ensure minimum movement for visibility (even in Easy mode)
  const bodyX = Math.abs(baseBodyX) < 2 && baseBodyX !== 0 ? (baseBodyX > 0 ? 3 : -3) : baseBodyX;
  const bodyY = Math.abs(baseBodyY) < 2 && baseBodyY !== 0 ? (baseBodyY > 0 ? 3 : -3) : baseBodyY;
  const bodyRotation = Math.abs(baseBodyRotation) < 2 && baseBodyRotation !== 0 ? (baseBodyRotation > 0 ? 3 : -3) : baseBodyRotation;

  // Get animation speed multiplier based on difficulty - increased contrast
  const getSpeedMultiplier = () => {
    switch (difficulty) {
      case 'easy':
        return 0.5; // Significantly slower (50% speed) for beginners
      case 'medium':
        return 0.85; // Slightly faster than Easy, moderate pace
      case 'hard':
        return 2.0; // Very fast and challenging (200% speed) - maximum difficulty
      default:
        return 1.0;
    }
  };

  const speedMultiplier = getSpeedMultiplier();

  // Reduce arm/leg extension for Easy mode (simpler movements)
  // But ensure movements are still clearly visible
  // Hard mode: enhanced extension for maximum challenge
  const getLimbRangeMultiplier = () => {
    switch (difficulty) {
      case 'easy':
        return 0.75; // Reduced to 75% to ensure movements are still clearly visible
      case 'medium':
        return 0.9; // 90% for moderate challenge
      case 'hard':
        return 1.15; // Enhanced to 115% - maximum limb extension for maximum challenge
      default:
        return 1.0;
    }
  };

  const limbRangeMultiplier = getLimbRangeMultiplier();

  // Apply limb range adjustment for all modes
  // Easy/Medium: reduce range, Hard: enhance range
  // Calculate adjusted arm/leg positions relative to neutral
  const adjustLimbPosition = (neutralPos: number, currentPos: number) => {
    const offset = currentPos - neutralPos;
    // For Hard mode, enhance the offset to make movements more dramatic
    const adjustedOffset = difficulty === 'hard' 
      ? offset * limbRangeMultiplier * 1.1 // Extra 10% enhancement for Hard mode
      : offset * limbRangeMultiplier;
    return neutralPos + adjustedOffset;
  };

  const neutralConfig = poseConfigs['Neutral'];
  
  // Adjust left arm positions
  const adjustedLeftArm = {
    ...config.leftArm,
    elbow: {
      ...config.leftArm.elbow,
      x: adjustLimbPosition(neutralConfig.leftArm.elbow.x, config.leftArm.elbow.x),
      y: adjustLimbPosition(neutralConfig.leftArm.elbow.y, config.leftArm.elbow.y),
    },
    hand: {
      ...config.leftArm.hand,
      x: adjustLimbPosition(neutralConfig.leftArm.hand.x, config.leftArm.hand.x),
      y: adjustLimbPosition(neutralConfig.leftArm.hand.y, config.leftArm.hand.y),
    },
  };

  // Adjust right arm positions
  const adjustedRightArm = {
    ...config.rightArm,
    elbow: {
      ...config.rightArm.elbow,
      x: adjustLimbPosition(neutralConfig.rightArm.elbow.x, config.rightArm.elbow.x),
      y: adjustLimbPosition(neutralConfig.rightArm.elbow.y, config.rightArm.elbow.y),
    },
    hand: {
      ...config.rightArm.hand,
      x: adjustLimbPosition(neutralConfig.rightArm.hand.x, config.rightArm.hand.x),
      y: adjustLimbPosition(neutralConfig.rightArm.hand.y, config.rightArm.hand.y),
    },
  };

  // Adjust left leg positions
  const adjustedLeftLeg = {
    ...config.leftLeg,
    knee: {
      ...config.leftLeg.knee,
      x: adjustLimbPosition(neutralConfig.leftLeg.knee.x, config.leftLeg.knee.x),
      y: adjustLimbPosition(neutralConfig.leftLeg.knee.y, config.leftLeg.knee.y),
    },
    foot: {
      ...config.leftLeg.foot,
      x: adjustLimbPosition(neutralConfig.leftLeg.foot.x, config.leftLeg.foot.x),
      y: adjustLimbPosition(neutralConfig.leftLeg.foot.y, config.leftLeg.foot.y),
    },
  };

  // Adjust right leg positions
  const adjustedRightLeg = {
    ...config.rightLeg,
    knee: {
      ...config.rightLeg.knee,
      x: adjustLimbPosition(neutralConfig.rightLeg.knee.x, config.rightLeg.knee.x),
      y: adjustLimbPosition(neutralConfig.rightLeg.knee.y, config.rightLeg.knee.y),
    },
    foot: {
      ...config.rightLeg.foot,
      x: adjustLimbPosition(neutralConfig.rightLeg.foot.x, config.rightLeg.foot.x),
      y: adjustLimbPosition(neutralConfig.rightLeg.foot.y, config.rightLeg.foot.y),
    },
  };

  // Glow intensity - increased for better visibility, especially for Hard mode
  const baseGlowIntensity = difficulty === 'hard' ? 2.5 : (beatActive ? 2.2 : 1.5);
  const glowIntensity = beatActive ? baseGlowIntensity : (difficulty === 'hard' ? 2.0 : 1.5);
  
  // Increased stroke width for better visibility across all difficulty levels
  // Hard mode gets slightly thicker lines to maintain visibility at high speed
  const baseStrokeWidth = difficulty === 'easy' ? 4.5 : difficulty === 'medium' ? 4 : difficulty === 'hard' ? 4.2 : 3.5;
  const strokeWidth = beatActive ? baseStrokeWidth + 1.5 : baseStrokeWidth;

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 245, 255, 0.5) 0%, rgba(255, 0, 80, 0.3) 50%, transparent 70%)',
          filter: 'blur(30px)',
          top: '10%',
          bottom: '10%',
          left: '10%',
          right: '10%',
        }}
        animate={{
          opacity: beatActive ? [0.7, 1, 0.7] : [0.5, 0.6, 0.5],
          scale: beatActive ? [1, 1.15, 1] : [1, 1.03, 1],
        }}
        transition={{
          duration: 0.5 / speedMultiplier,
          repeat: Infinity,
        }}
      />

      {/* Main ghost */}
      <motion.svg
        viewBox="0 0 300 350"
        className="w-full h-full relative z-10"
        style={{
          filter: `drop-shadow(0 0 ${20 * glowIntensity}px rgba(0, 245, 255, 1)) drop-shadow(0 0 ${40 * glowIntensity}px rgba(255, 0, 80, 0.7))`,
        }}
        animate={{
          x: bodyX,
          y: bodyY,
          scale: difficulty === 'hard' ? (config.bodyScale || 1) * 1.05 : (config.bodyScale || 1), // Slightly larger scale for Hard mode
          rotate: bodyRotation,
        }}
        transition={{
          duration: difficulty === 'hard' 
            ? 0.4 / speedMultiplier // Faster transitions for Hard mode
            : 0.6 / speedMultiplier, // Slightly longer for Easy/Medium visibility
          ease: difficulty === 'hard' 
            ? [0.4, 0, 0.2, 1] // Sharper easing for Hard mode (more snappy)
            : [0.25, 0.1, 0.25, 1], // Smoother easing for Easy/Medium
          type: difficulty === 'hard' ? 'tween' : 'spring', // Linear for Hard, spring for others
          stiffness: difficulty === 'hard' ? 200 : 150, // Stiffer spring for Hard mode
          damping: difficulty === 'hard' ? 10 : 15, // Less damping for Hard mode (faster)
        }}
      >
        {/* Head - connected to neck */}
        <motion.ellipse
          cx={config.head.cx}
          cy={config.head.cy}
          rx={config.head.r}
          ry={config.head.r * 0.9}
          fill="rgba(0, 245, 255, 0.5)" // Increased fill opacity for better visibility
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          animate={{
            cy: [config.head.cy, config.head.cy - 2, config.head.cy],
          }}
          transition={{
            duration: 1.2 / speedMultiplier, // Slightly slower for clearer movement
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Neck */}
        <motion.rect
          x={config.neck.x - config.neck.width / 2}
          y={config.neck.y}
          width={config.neck.width}
          height={config.neck.height}
          fill="rgba(0, 245, 255, 0.55)" // Increased fill opacity
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          rx={2}
          transform={`rotate(${config.neck.rotation} ${config.neck.x} ${config.neck.y})`}
        />

        {/* Torso */}
        <motion.rect
          x={config.torso.x - config.torso.width / 2}
          y={config.torso.y}
          width={config.torso.width}
          height={config.torso.height}
          fill="rgba(0, 245, 255, 0.55)" // Increased fill opacity
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          rx={8}
          transform={`rotate(${config.torso.rotation} ${config.torso.x} ${config.torso.y + config.torso.height / 2})`}
        />

        {/* Left Arm */}
        <motion.line
          x1={adjustedLeftArm.shoulder.x}
          y1={adjustedLeftArm.shoulder.y}
          x2={adjustedLeftArm.elbow.x}
          y2={adjustedLeftArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedLeftArm.width, strokeWidth * 0.8)} // Ensure minimum width
          strokeLinecap="round"
          strokeOpacity={0.95} // High opacity for clarity
        />
        <motion.line
          x1={adjustedLeftArm.elbow.x}
          y1={adjustedLeftArm.elbow.y}
          x2={adjustedLeftArm.hand.x}
          y2={adjustedLeftArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedLeftArm.width - 1, strokeWidth * 0.7)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />

        {/* Right Arm */}
        <motion.line
          x1={adjustedRightArm.shoulder.x}
          y1={adjustedRightArm.shoulder.y}
          x2={adjustedRightArm.elbow.x}
          y2={adjustedRightArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedRightArm.width, strokeWidth * 0.8)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />
        <motion.line
          x1={adjustedRightArm.elbow.x}
          y1={adjustedRightArm.elbow.y}
          x2={adjustedRightArm.hand.x}
          y2={adjustedRightArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedRightArm.width - 1, strokeWidth * 0.7)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />

        {/* Left Leg */}
        <motion.line
          x1={adjustedLeftLeg.hip.x}
          y1={adjustedLeftLeg.hip.y}
          x2={adjustedLeftLeg.knee.x}
          y2={adjustedLeftLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedLeftLeg.width, strokeWidth * 0.85)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />
        <motion.line
          x1={adjustedLeftLeg.knee.x}
          y1={adjustedLeftLeg.knee.y}
          x2={adjustedLeftLeg.foot.x}
          y2={adjustedLeftLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedLeftLeg.width - 1, strokeWidth * 0.75)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />

        {/* Right Leg */}
        <motion.line
          x1={adjustedRightLeg.hip.x}
          y1={adjustedRightLeg.hip.y}
          x2={adjustedRightLeg.knee.x}
          y2={adjustedRightLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedRightLeg.width, strokeWidth * 0.85)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />
        <motion.line
          x1={adjustedRightLeg.knee.x}
          y1={adjustedRightLeg.knee.y}
          x2={adjustedRightLeg.foot.x}
          y2={adjustedRightLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={Math.max(adjustedRightLeg.width - 1, strokeWidth * 0.75)}
          strokeLinecap="round"
          strokeOpacity={0.95}
        />
      </motion.svg>
    </div>
  );
}

