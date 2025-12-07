import { motion } from 'motion/react';
import { choreographyPatterns } from '../utils/choreography';

interface AnimatedGhostProps {
  poseName: string;
  beatActive?: boolean;
  songId?: string;
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
  className = '' 
}: AnimatedGhostProps) {
  const config = poseConfigs[poseName] || poseConfigs['Neutral'];
  
  const bodyX = config.bodyX || 0;
  const bodyY = config.bodyY || 0;
  const bodyRotation = config.bodyRotation || 0;

  // Glow intensity
  const glowIntensity = beatActive ? 1.8 : 1;
  const strokeWidth = beatActive ? 4 : 3;

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
          fill="rgba(0, 245, 255, 0.3)"
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          animate={{
            cy: [config.head.cy, config.head.cy - 2, config.head.cy],
          }}
          transition={{
            duration: 1,
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
          fill="rgba(0, 245, 255, 0.4)"
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
          fill="rgba(0, 245, 255, 0.4)"
          stroke="#00F5FF"
          strokeWidth={strokeWidth}
          rx={8}
          transform={`rotate(${config.torso.rotation} ${config.torso.x} ${config.torso.y + config.torso.height / 2})`}
        />

        {/* Left Arm */}
        <motion.line
          x1={config.leftArm.shoulder.x}
          y1={config.leftArm.shoulder.y}
          x2={config.leftArm.elbow.x}
          y2={config.leftArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={config.leftArm.width}
          strokeLinecap="round"
        />
        <motion.line
          x1={config.leftArm.elbow.x}
          y1={config.leftArm.elbow.y}
          x2={config.leftArm.hand.x}
          y2={config.leftArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={config.leftArm.width - 1}
          strokeLinecap="round"
        />

        {/* Right Arm */}
        <motion.line
          x1={config.rightArm.shoulder.x}
          y1={config.rightArm.shoulder.y}
          x2={config.rightArm.elbow.x}
          y2={config.rightArm.elbow.y}
          stroke="#00F5FF"
          strokeWidth={config.rightArm.width}
          strokeLinecap="round"
        />
        <motion.line
          x1={config.rightArm.elbow.x}
          y1={config.rightArm.elbow.y}
          x2={config.rightArm.hand.x}
          y2={config.rightArm.hand.y}
          stroke="#00F5FF"
          strokeWidth={config.rightArm.width - 1}
          strokeLinecap="round"
        />

        {/* Left Leg */}
        <motion.line
          x1={config.leftLeg.hip.x}
          y1={config.leftLeg.hip.y}
          x2={config.leftLeg.knee.x}
          y2={config.leftLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={config.leftLeg.width}
          strokeLinecap="round"
        />
        <motion.line
          x1={config.leftLeg.knee.x}
          y1={config.leftLeg.knee.y}
          x2={config.leftLeg.foot.x}
          y2={config.leftLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={config.leftLeg.width - 1}
          strokeLinecap="round"
        />

        {/* Right Leg */}
        <motion.line
          x1={config.rightLeg.hip.x}
          y1={config.rightLeg.hip.y}
          x2={config.rightLeg.knee.x}
          y2={config.rightLeg.knee.y}
          stroke="#00F5FF"
          strokeWidth={config.rightLeg.width}
          strokeLinecap="round"
        />
        <motion.line
          x1={config.rightLeg.knee.x}
          y1={config.rightLeg.knee.y}
          x2={config.rightLeg.foot.x}
          y2={config.rightLeg.foot.y}
          stroke="#00F5FF"
          strokeWidth={config.rightLeg.width - 1}
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}

