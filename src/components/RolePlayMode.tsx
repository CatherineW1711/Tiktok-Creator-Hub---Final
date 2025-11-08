import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Merge } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import BottomNav from './BottomNav';

interface RolePlayModeProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onPublish: () => void;
}

export default function RolePlayMode({ onBack, onNavigate, onPublish }: RolePlayModeProps) {
  const [roleARecorded, setRoleARecorded] = useState(false);
  const [roleBRecorded, setRoleBRecorded] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState([0]);

  const handleMerge = () => {
    if (roleARecorded && roleBRecorded) {
      setIsMerged(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Role Play Mode</h2>
        <div className="w-6" />
      </div>

      {/* Split Screen */}
      <div className="absolute top-28 left-6 right-6 flex space-x-3" style={{ height: '340px' }}>
        {/* Role A - Teacher */}
        <motion.div
          className="flex-1 bg-[#121212] rounded-2xl border-2 overflow-hidden"
          animate={{
            borderColor: roleARecorded ? '#00F5FF' : '#1f2937',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header Label */}
            <div className="bg-[#00F5FF]/20 border-b border-[#00F5FF]/30 px-3 py-2">
              <p className="text-[#00F5FF] text-xs text-center">Role A – Teacher</p>
            </div>

            {/* Preview */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1a1a1a] relative">
              <p className="text-gray-600 text-sm">Camera Preview</p>
              {roleARecorded && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00F5FF]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Script */}
            <div className="p-3 bg-black/50 border-t border-gray-800">
              <p className="text-white text-xs leading-relaxed">"Can you explain this concept?"</p>
            </div>

            {/* Record button */}
            <div className="p-3 flex justify-center bg-[#0a0a0a]">
              <motion.button
                onClick={() => setRoleARecorded(!roleARecorded)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  roleARecorded ? 'border-[#00F5FF]' : 'border-gray-700'
                }`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-6 h-6 rounded-full ${roleARecorded ? 'bg-white' : 'bg-[#00F5FF]'}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Role B - Student */}
        <motion.div
          className="flex-1 bg-[#121212] rounded-2xl border-2 overflow-hidden"
          animate={{
            borderColor: roleBRecorded ? '#FF0050' : '#1f2937',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header Label */}
            <div className="bg-[#FF0050]/20 border-b border-[#FF0050]/30 px-3 py-2">
              <p className="text-[#FF0050] text-xs text-center">Role B – Student</p>
            </div>

            {/* Preview */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1a1a1a] relative">
              <p className="text-gray-600 text-sm">Camera Preview</p>
              {roleBRecorded && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF0050]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Script */}
            <div className="p-3 bg-black/50 border-t border-gray-800">
              <p className="text-white text-xs leading-relaxed">"Sure, let me show you..."</p>
            </div>

            {/* Record button */}
            <div className="p-3 flex justify-center bg-[#0a0a0a]">
              <motion.button
                onClick={() => setRoleBRecorded(!roleBRecorded)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  roleBRecorded ? 'border-[#FF0050]' : 'border-gray-700'
                }`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-6 h-6 rounded-full ${roleBRecorded ? 'bg-white' : 'bg-[#FF0050]'}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shared Timeline/Progress Bar */}
      <div className="absolute top-[490px] left-6 right-6">
        <div className="bg-[#121212] rounded-xl p-4 border border-gray-800">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Merged Timeline</span>
              <span className="text-gray-400 text-xs">{Math.round(playbackProgress[0])}%</span>
            </div>
            <div className="relative">
              <Slider
                value={playbackProgress}
                onValueChange={setPlaybackProgress}
                max={100}
                step={1}
                className="cursor-pointer"
                disabled={!isMerged}
              />
              {isMerged && (
                <div className="flex items-center space-x-0.5 mt-2 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="flex-1 h-full bg-[#00F5FF]"
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div 
                    className="flex-1 h-full bg-[#FF0050]"
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </div>
              )}
            </div>
          </div>

          <ol className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${roleARecorded ? 'bg-[#00F5FF]' : 'bg-gray-700'}`} />
              <span className="text-gray-400">Record Role A (Teacher)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${roleBRecorded ? 'bg-[#FF0050]' : 'bg-gray-700'}`} />
              <span className="text-gray-400">Record Role B (Student)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isMerged ? 'bg-white' : 'bg-gray-700'}`} />
              <span className="text-gray-400">Auto Merge</span>
            </li>
          </ol>
        </div>

      </div>

      {/* Merge Preview */}
      {isMerged && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[630px] left-6 right-6 bg-[#121212] rounded-xl p-4 border-2 border-[#00F5FF]"
        >
          <p className="text-white text-sm text-center mb-2">✓ Merged Preview Ready</p>
          <div className="h-20 bg-gradient-to-r from-[#00F5FF]/20 to-[#FF0050]/20 rounded-lg flex items-center justify-center">
            <Merge className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute bottom-28 left-0 right-0 px-6">
        <div className="flex items-center justify-center space-x-3">
          {/* Merge Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleMerge}
              disabled={!roleARecorded || !roleBRecorded}
              className="px-6 py-6 rounded-xl text-white disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              }}
            >
              <Merge className="w-5 h-5 mr-2" />
              Merge
            </Button>
          </motion.div>

          {/* Publish Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onPublish}
              disabled={!isMerged}
              className="px-6 py-6 rounded-xl text-white disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
              }}
            >
              Publish
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="record" onNavigate={onNavigate} />
    </div>
  );
}
