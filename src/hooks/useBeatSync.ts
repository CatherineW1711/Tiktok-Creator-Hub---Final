import { useEffect, useRef } from 'react';
import { getBeatMap } from '../utils/beatMaps';

interface UseBeatSyncOptions {
  currentTime: number;
  songId: string | null;
  onBeat: () => void;
  threshold?: number; // seconds - how close to beat to trigger
}

export function useBeatSync({
  currentTime,
  songId,
  onBeat,
  threshold = 0.15,
}: UseBeatSyncOptions) {
  const lastBeatRef = useRef<number>(-1);
  const beatMapRef = useRef<number[]>([]);

  useEffect(() => {
    if (songId) {
      beatMapRef.current = getBeatMap(songId);
      lastBeatRef.current = -1;
    }
  }, [songId]);

  useEffect(() => {
    if (!songId || beatMapRef.current.length === 0) return;

    const beats = beatMapRef.current;
    const nextBeatIndex = beats.findIndex((beat) => beat > currentTime);

    if (nextBeatIndex === -1) return; // No more beats

    const nextBeat = beats[nextBeatIndex];
    const timeToBeat = nextBeat - currentTime;

    // Check if we're close enough to the beat
    if (timeToBeat >= 0 && timeToBeat <= threshold) {
      // Only trigger if we haven't already triggered for this beat
      if (lastBeatRef.current !== nextBeatIndex) {
        lastBeatRef.current = nextBeatIndex;
        onBeat();
      }
    }
  }, [currentTime, songId, onBeat, threshold]);
}

