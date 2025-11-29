import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2, Check } from 'lucide-react';
import { availableSongs, AudioTrack } from '../utils/beatMaps';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MusicSelectorProps {
  currentTrack: AudioTrack | null;
  onSelectTrack: (track: AudioTrack) => void;
}

export default function MusicSelector({ currentTrack, onSelectTrack }: MusicSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-[#121212] border-2 border-gray-700 hover:border-[#FF0050] transition-colors flex items-center space-x-2"
        >
          <Music2 className="w-4 h-4 text-white" />
          <span className="text-white text-sm">
            {currentTrack ? currentTrack.name : 'Choose Music'}
          </span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-[#121212] border-gray-800 p-2">
        <div className="space-y-1">
          {availableSongs.map((song) => (
            <motion.button
              key={song.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectTrack(song);
                setOpen(false);
              }}
              className="w-full px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center justify-between"
            >
              <span className="text-white text-sm">{song.name}</span>
              {currentTrack?.id === song.id && (
                <Check className="w-4 h-4 text-[#00F5FF]" />
              )}
            </motion.button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

