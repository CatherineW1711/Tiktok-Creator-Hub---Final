export const choreographyPatterns: Record<string, string[]> = {
  greedy: ['Neutral', 'Arm Wave', 'Side Step', 'Body Wave', 'Jump Pose', 'Arm Wave', 'Side Step', 'Neutral'],
  woman: ['Neutral', 'Hip Sway', 'Arm Flow', 'Torso Twist', 'Hip Sway', 'Arm Flow', 'Torso Twist', 'Neutral'],
  trend1: ['Neutral', 'Arm Wave', 'Side Step', 'Body Wave', 'Jump Pose', 'Arm Wave', 'Side Step', 'Neutral'],
  renai: ['Neutral', 'Gentle Sway', 'Arm Flow', 'Hip Sway', 'Gentle Sway', 'Arm Flow', 'Hip Sway', 'Neutral'],
};

export function getChoreographyPattern(songId: string): string[] {
  return choreographyPatterns[songId] || choreographyPatterns.greedy;
}

