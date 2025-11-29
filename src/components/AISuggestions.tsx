import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface AISuggestionsProps {
  suggestions: string[];
  onClose: () => void;
}

export default function AISuggestions({ suggestions, onClose }: AISuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-24 left-6 right-6 z-30 bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-2xl border-2 border-[#00F5FF]/30 p-4 shadow-2xl"
        style={{
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#00F5FF]" />
            <h3 className="text-white font-semibold" style={{ fontSize: '16px' }}>
              AI Suggestions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg bg-[#0a0a0a]/50 border border-[#00F5FF]/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-2 flex-shrink-0" />
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontSize: '14px' }}>
                {suggestion}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

