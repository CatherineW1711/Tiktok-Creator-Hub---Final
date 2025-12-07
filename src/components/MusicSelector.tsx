import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, ChevronDown } from 'lucide-react';
import { Song, availableSongs } from '../utils/beatMaps';

interface MusicSelectorProps {
  currentTrack: Song | null;
  onSelectTrack: (track: Song) => void;
}

export default function MusicSelector({ currentTrack, onSelectTrack }: MusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#121212] border-2 border-gray-700 hover:border-[#00F5FF] transition-colors"
        style={{ minWidth: '120px' }}
      >
        <Music className="w-4 h-4 text-[#00F5FF]" />
        <span className="text-white text-sm font-medium">
          {currentTrack?.name || 'Select'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 z-50 bg-[#121212] border-2 border-gray-700 rounded-lg overflow-hidden min-w-[160px]"
            >
              {availableSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => {
                    onSelectTrack(song);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#1a1a1a] transition-colors ${
                    currentTrack?.id === song.id ? 'bg-[#00F5FF]/20 text-[#00F5FF]' : 'text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4" />
                    <span className="text-sm font-medium">{song.name}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

