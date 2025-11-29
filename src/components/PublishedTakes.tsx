import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Play } from 'lucide-react';

export interface Take {
  id: string;
  duration: number;
  lastMove: string;
  timestamp: string;
  poseSequence: number[];
  blobUrl: string;
  createdAt: string;
}

interface PublishedTakesProps {
  takes: Take[];
  onBack: () => void;
  onDeleteTake: (takeId: string) => void;
}

export default function PublishedTakes({ takes, onBack, onDeleteTake }: PublishedTakesProps) {
  const [selectedTake, setSelectedTake] = useState<Take | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                className="relative bg-[#121212] rounded-xl overflow-hidden border-2 border-gray-800 hover:border-[#00F5FF] transition-colors cursor-pointer"
                onClick={() => setSelectedTake(take)}
              >
                {/* Video Thumbnail */}
                <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
                  <video
                    src={take.blobUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1">
                    <p className="text-white text-xs">{formatDuration(take.duration)}</p>
                  </div>
                </div>
                
                {/* Take Info */}
                <div className="p-3">
                  <p className="text-white text-sm mb-1 truncate">{take.lastMove}</p>
                  <p className="text-gray-400 text-xs">{take.timestamp}</p>
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
              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  src={selectedTake.blobUrl}
                  controls
                  autoPlay
                  className="w-full"
                  style={{ maxHeight: '80vh' }}
                />
              </div>

              {/* Video Info */}
              <div className="mt-4 text-center">
                <p className="text-white text-lg mb-1">{selectedTake.lastMove}</p>
                <p className="text-gray-400 text-sm">{selectedTake.timestamp}</p>
                <p className="text-gray-500 text-xs mt-1">Duration: {formatDuration(selectedTake.duration)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

