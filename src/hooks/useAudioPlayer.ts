import { useState, useEffect, useRef } from 'react';
import { Song } from '../utils/beatMaps';

export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentTrack) return;

    const audio = new Audio(currentTrack.file);
    audioRef.current = audio;

    // Add comprehensive error handling for audio loading
    const handleError = (e: Event) => {
      console.error('Audio loading error:', e, 'File:', currentTrack.file);
      console.error('Audio error details:', (audio as any).error);
    };

    const handleCanPlay = () => {
      console.log('Audio loaded successfully:', currentTrack.file);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Preload audio
    audio.preload = 'auto';
    try {
      const loadResult = audio.load();
      // load() may not return a Promise in all browsers
      if (loadResult && typeof loadResult.catch === 'function') {
        loadResult.catch((error: any) => {
          console.error('Failed to load audio:', error, 'File:', currentTrack.file);
        });
      }
    } catch (error) {
      console.error('Error calling audio.load():', error, 'File:', currentTrack.file);
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  const play = async (startTime: number = 0) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = startTime;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const getAudioElement = () => audioRef.current;

  return {
    currentTrack,
    setTrack: setCurrentTrack,
    play,
    pause,
    seek,
    currentTime,
    isPlaying,
    audioElement: audioRef.current,
    getAudioElement,
  };
}

