import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Play, Music, Trash2 } from 'lucide-react';

export interface Take {
  id: string;
  duration: number;
  lastMove: string;
  timestamp: string;
  poseSequence: number[];
  blobUrl: string;
  createdAt: string;
  aiSuggestions?: string[]; // Static AI suggestions for this video
  songId?: string; // Music track ID used during recording
  songName?: string; // Music track name for display
}

interface PublishedTakesProps {
  takes: Take[];
  onBack: () => void;
  onDeleteTake: (takeId: string) => void;
}

export default function PublishedTakes({ takes, onBack, onDeleteTake }: PublishedTakesProps) {
  const [selectedTake, setSelectedTake] = useState<Take | null>(null);
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load video durations for all takes
  useEffect(() => {
    const loadDurations = async () => {
      const durations: Record<string, number> = {};
      
      for (const take of takes) {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = take.blobUrl;
          
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              if (video.duration && !isNaN(video.duration)) {
                durations[take.id] = video.duration;
              }
              resolve(null);
            };
            video.onerror = reject;
          });
        } catch (error) {
          console.warn(`Failed to load duration for take ${take.id}:`, error);
          // Fallback to stored duration
          durations[take.id] = take.duration;
        }
      }
      
      setVideoDurations(durations);
    };

    if (takes.length > 0) {
      loadDurations();
    }
  }, [takes]);

  // Update progress for selected video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedTake) return;

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
    updateProgress();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [selectedTake]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Published Takes</h2>
        <div className="w-6" />
      </div>

      {/* Takes Grid */}
      <div className="absolute top-28 bottom-4 left-6 right-6 overflow-y-auto">
        {takes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 text-center" style={{ fontSize: '16px' }}>
              No published takes yet
            </p>
            <p className="text-gray-600 text-center mt-2" style={{ fontSize: '14px' }}>
              Record some takes in Dance Mode to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {takes.map((take) => (
              <motion.div
                key={take.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-[#121212] rounded-xl overflow-hidden border-2 border-gray-800 hover:border-[#00F5FF] transition-colors"
              >
                {/* Video Thumbnail */}
                <div 
                  className="relative w-full cursor-pointer" 
                  style={{ aspectRatio: '9/16' }}
                  onClick={() => setSelectedTake(take)}
                >
                  <video
                    src={take.blobUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                  
                  {/* Duration - Top Right */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md rounded px-2 py-1 z-10">
                    <p className="text-white text-xs font-medium">
                      {formatDuration(videoDurations[take.id] || take.duration)}
                    </p>
                  </div>
                  
                  {/* Music Label - Top Left (moved up to avoid overlap) */}
                  {take.songName && (
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md rounded px-2 py-1 flex items-center space-x-1.5 z-10 max-w-[calc(100%-80px)]">
                      <Music className="w-3 h-3 text-[#00F5FF] flex-shrink-0" />
                      <p className="text-white text-xs font-medium truncate">
                        {take.songName}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Take Info - Clean vertical layout */}
                <div className="p-3 space-y-1.5">
                  <p className="text-white text-sm font-medium truncate">{take.lastMove}</p>
                  <p className="text-gray-400 text-xs">{take.timestamp}</p>
                  {take.songName && (
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <Music className="w-3 h-3 text-[#00F5FF] flex-shrink-0" />
                      <p className="text-[#00F5FF] text-xs truncate">{take.songName}</p>
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <div className="pt-2 mt-2 border-t border-gray-800">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this take?')) {
                          onDeleteTake(take.id);
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-[#FF0050]/20 hover:bg-[#FF0050]/30 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4 text-[#FF0050]" />
                      <span className="text-[#FF0050] text-xs font-medium">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedTake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTake(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTake(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden relative">
                <video
                  ref={videoRef}
                  src={selectedTake.blobUrl}
                  controls
                  autoPlay
                  className="w-full"
                  style={{ maxHeight: '80vh' }}
                />
                
                {/* Music Label - Top Left */}
                {selectedTake.songName && (
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 flex items-center space-x-2 z-10">
                    <Music className="w-4 h-4 text-[#00F5FF]" />
                    <p className="text-white text-sm font-medium">
                      {selectedTake.songName}
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
                    {formatDuration(currentTime)} / {formatDuration(duration || videoDurations[selectedTake.id] || selectedTake.duration)}
                  </p>
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-4 text-center">
                <p className="text-white text-lg mb-1">{selectedTake.lastMove}</p>
                <p className="text-gray-400 text-sm">{selectedTake.timestamp}</p>
                {selectedTake.songName && (
                  <div className="flex items-center justify-center space-x-2 mt-2 mb-1">
                    <Music className="w-4 h-4 text-[#00F5FF]" />
                    <p className="text-[#00F5FF] text-sm font-medium">{selectedTake.songName}</p>
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Duration: {formatDuration(duration || videoDurations[selectedTake.id] || selectedTake.duration)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

