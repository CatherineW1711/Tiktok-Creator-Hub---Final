// AI Suggestions generator (placeholder/heuristic-based)
// In production, this would analyze the video using pose detection or other ML models

export interface RecordingAnalysis {
  duration: number;
  poseSequence: number[];
  lastMove: string;
  songId?: string;
}

export function generateAISuggestions(analysis: RecordingAnalysis): string[] {
  const suggestions: string[] = [];

  // Heuristic-based suggestions (placeholder for real AI analysis)
  
  // Duration-based
  if (analysis.duration < 5) {
    suggestions.push("Try recording a longer take — aim for 8-10 seconds for better engagement!");
  } else if (analysis.duration > 15) {
    suggestions.push("Great length! Consider keeping takes under 15 seconds for maximum TikTok engagement.");
  }

  // Movement variety
  const uniquePoses = new Set(analysis.poseSequence).size;
  if (uniquePoses < 3) {
    suggestions.push("Add more movement variety — try mixing different arm and leg positions for dynamic energy!");
  } else if (uniquePoses >= 4) {
    suggestions.push("Excellent movement variety! Your choreography has great flow.");
  }

  // Song-specific suggestions
  if (analysis.songId === 'renai') {
    suggestions.push("For Renai's smooth vibe, try adding more gentle body waves and hip sways.");
  } else if (analysis.songId === 'greedy') {
    suggestions.push("Greedy calls for big energy! Try bigger arm swings on the chorus for more impact.");
  } else if (analysis.songId === 'woman') {
    suggestions.push("Woman has a powerful beat — emphasize your movements on each beat for maximum effect!");
  }

  // General engagement tips
  const randomTips = [
    "Your energy is great — try holding eye contact with the camera longer for more engagement.",
    "Consider adding a smile or expressive face to connect better with viewers!",
    "Try syncing your biggest movements with the song's beat drops for maximum impact.",
    "Great timing! Keep practicing to make your movements even sharper and more precise.",
  ];

  // Add 1-2 random tips if we don't have enough suggestions
  if (suggestions.length < 3) {
    const remaining = 3 - suggestions.length;
    const shuffled = [...randomTips].sort(() => Math.random() - 0.5);
    suggestions.push(...shuffled.slice(0, remaining));
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

