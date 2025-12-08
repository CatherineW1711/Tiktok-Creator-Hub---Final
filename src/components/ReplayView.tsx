import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, X, Trash2, CheckCircle2, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Take } from './PublishedTakes';

interface ReplayViewProps {
  take: Take;
  onClose: () => void;
  onDelete: () => void;
  onPublish: () => void;
}

export default function ReplayView({ take, onClose, onDelete, onPublish }: ReplayViewProps) {
  // Use stored suggestions from the take object - do NOT regenerate
  // If suggestions don't exist (for old takes), show empty array
  const suggestions = take.aiSuggestions || [];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Update progress as video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleTimeUpdate = () => updateProgress();

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Initial load
    handleLoadedMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [take.blobUrl]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full bg-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 pt-12 pb-4 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <button onClick={onClose} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Replay</h2>
        <div className="w-6" />
      </div>

      {/* Video Player - Full width, 9:16 aspect ratio (portrait) */}
      <div className="w-full px-6 pt-6">
        <div 
          className="relative w-full bg-black rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '9/16', // Portrait for TikTok
            minHeight: '350px',
          }}
        >
          <video
            ref={videoRef}
            src={take.blobUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            style={{
              backgroundColor: '#000',
            }}
          />
          
          {/* Music Label - Top Left */}
          {take.songName && (
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 flex items-center space-x-2 z-10">
              <Music className="w-4 h-4 text-[#00F5FF]" />
              <p className="text-white text-sm font-medium">
                {take.songName}
              </p>
            </div>
          )}
          
          {/* Custom Progress Bar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
            <motion.div
              className="h-full bg-[#00F5FF]"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Time Display */}
          <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
            <p className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>
      </div>

      {/* AI Suggestions Card - Below video */}
      {suggestions.length > 0 && (
        <div className="px-6 pt-6">
          <div
            className="w-full rounded-2xl p-5"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 245, 255, 0.2)',
            }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#00F5FF]" />
              <h3 className="text-white font-semibold" style={{ fontSize: '16px' }}>
                AI Suggestions
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start"
                >
                  <p 
                    className="text-white leading-relaxed"
                    style={{ 
                      fontSize: '15px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    • {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pt-6 pb-8 space-y-3">
        <Button
          onClick={onPublish}
          className="w-full text-white"
          style={{
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
            boxShadow: '0 4px 20px rgba(0, 245, 255, 0.4)',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Publish
        </Button>

        <Button
          onClick={onDelete}
          className="w-full text-white bg-[#121212] border-2 border-[#FF0050]/50 hover:border-[#FF0050] transition-colors"
          style={{
            height: '56px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}

