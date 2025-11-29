// Choreography segment definitions for Training Mode
export interface ChoreographySegment {
  name: string;
  duration: number; // seconds
  animation: string; // Lottie file path
}

export interface Choreography {
  [songId: string]: ChoreographySegment[];
}

export const choreography: Choreography = {
  greedy: [
    { name: 'Intro', duration: 3, animation: '/animations/hiphop_intro.json' },
    { name: 'Chorus', duration: 5, animation: '/animations/hiphop_chorus.json' },
    { name: 'Ending', duration: 4, animation: '/animations/hiphop_end.json' },
  ],
  woman: [
    { name: 'Intro', duration: 3, animation: '/animations/hiphop_intro.json' },
    { name: 'Chorus', duration: 5, animation: '/animations/hiphop_chorus.json' },
    { name: 'Ending', duration: 4, animation: '/animations/hiphop_end.json' },
  ],
  trend1: [
    { name: 'Intro', duration: 3, animation: '/animations/hiphop_intro.json' },
    { name: 'Chorus', duration: 5, animation: '/animations/hiphop_chorus.json' },
    { name: 'Ending', duration: 4, animation: '/animations/hiphop_end.json' },
  ],
  renai: [
    { name: 'Intro', duration: 3, animation: '/animations/hiphop_intro.json' },
    { name: 'Chorus', duration: 5, animation: '/animations/hiphop_chorus.json' },
    { name: 'Ending', duration: 4, animation: '/animations/hiphop_end.json' },
  ],
};

// Animation mapping for dance moves
export const moveAnimations: Record<string, string> = {
  'Neutral': '/animations/hiphop.json',
  'Arm Wave': '/animations/shuffle.json',
  'Leg Lift': '/animations/hiphop.json',
  'Arm Cross': '/animations/shuffle.json',
  'Jump Pose': '/animations/hiphop.json',
};

export function getAnimationForMove(moveName: string): string {
  return moveAnimations[moveName] || '/animations/hiphop.json';
}

