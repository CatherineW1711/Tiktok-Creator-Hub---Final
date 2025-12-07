import { useEffect, useRef } from 'react';
import { beatMaps } from '../utils/beatMaps';

interface UseBeatSyncProps {
  currentTime: number;
  songId: string | null;
  onBeat: () => void;
}

export function useBeatSync({ currentTime, songId, onBeat }: UseBeatSyncProps) {
  const lastBeatRef = useRef<number>(-1);

  useEffect(() => {
    if (!songId) return;

    const beats = beatMaps[songId] || [];
    if (beats.length === 0) return;

    // Find the current beat index
    const currentBeatIndex = beats.findIndex((beat, index) => {
      const nextBeat = beats[index + 1];
      return currentTime >= beat && (nextBeat === undefined || currentTime < nextBeat);
    });

    if (currentBeatIndex !== -1 && currentBeatIndex !== lastBeatRef.current) {
      lastBeatRef.current = currentBeatIndex;
      onBeat();
    }
  }, [currentTime, songId, onBeat]);
}

