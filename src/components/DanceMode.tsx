import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Square, Trash2, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface DanceModeProps {
  onBack: () => void;
  onPublish: () => void;
}

// 5 different ghost dancer poses with labels
const dancePoses = [
  { id: 1, name: 'Neutral', headY: 120, armLeft: { x2: 120, y2: 190 }, armRight: { x2: 180, y2: 190 }, legLeft: { x2: 130, y2: 280 }, legRight: { x2: 170, y2: 280 } },
  { id: 2, name: 'Arm Up', headY: 110, armLeft: { x2: 110, y2: 170 }, armRight: { x2: 190, y2: 170 }, legLeft: { x2: 120, y2: 290 }, legRight: { x2: 180, y2: 290 } },
  { id: 3, name: 'Leg Lift', headY: 115, armLeft: { x2: 125, y2: 180 }, armRight: { x2: 175, y2: 180 }, legLeft: { x2: 140, y2: 270 }, legRight: { x2: 160, y2: 270 } },
  { id: 4, name: 'Spin', headY: 120, armLeft: { x2: 115, y2: 195 }, armRight: { x2: 185, y2: 195 }, legLeft: { x2: 125, y2: 285 }, legRight: { x2: 175, y2: 285 } },
  { id: 5, name: 'Final Pose', headY: 118, armLeft: { x2: 130, y2: 175 }, armRight: { x2: 170, y2: 175 }, legLeft: { x2: 135, y2: 275 }, legRight: { x2: 165, y2: 275 } },
];

interface Take {
  id: string;
  duration: number;
  lastMove: string;
  timestamp: string;
  poseSequence: number[]; // Store the sequence of poses for replay
}

export default function DanceMode({ onBack, onPublish }: DanceModeProps) {
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPose, setCurrentPose] = useState(0);
  const [takes, setTakes] = useState<Take[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedTake, setSelectedTake] = useState<string | null>(null);
  const [replayingTake, setReplayingTake] = useState<string | null>(null);
  const [recordedPoseSequence, setRecordedPoseSequence] = useState<number[]>([]);

  // Preview animation loop
  useEffect(() => {
    if (!isPreviewPlaying || isRecording || replayingTake) return;
    
    const interval = setInterval(() => {
      setCurrentPose((prev) => (prev + 1) % dancePoses.length);
    }, 1000); // 1 second per pose

    return () => clearInterval(interval);
  }, [isPreviewPlaying, isRecording, replayingTake]);

  // Recording animation loop and duration tracker
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setCurrentPose((prev) => {
        const nextPose = (prev + 1) % dancePoses.length;
        setRecordedPoseSequence((seq) => [...seq, nextPose]);
        return nextPose;
      });
    }, 1000); // 1 second per pose

    return () => clearInterval(interval);
  }, [isRecording]);

  // Recording duration tracker
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      if (recordingStartTime) {
        const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
        setRecordingDuration(duration);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);

  // Replay functionality
  useEffect(() => {
    if (!replayingTake) return;

    const take = takes.find(t => t.id === replayingTake);
    if (!take) return;

    let poseIndex = 0;
    const interval = setInterval(() => {
      if (poseIndex < take.poseSequence.length) {
        setCurrentPose(take.poseSequence[poseIndex]);
        poseIndex++;
      } else {
        setReplayingTake(null);
        setCurrentPose(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [replayingTake, takes]);

  const handlePreviewToggle = () => {
    if (isRecording) return; // Can't preview while recording
    setIsPreviewPlaying(!isPreviewPlaying);
    if (isPreviewPlaying) {
      setCurrentPose(0);
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording and save take
      const duration = Math.floor((Date.now() - (recordingStartTime || Date.now())) / 1000);
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newTake: Take = {
        id: Date.now().toString(),
        duration: duration,
        lastMove: dancePoses[currentPose].name,
        timestamp: timestamp,
        poseSequence: recordedPoseSequence,
      };

      setTakes([newTake, ...takes]);
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
      setRecordedPoseSequence([]);
      setCurrentPose(0);
    } else {
      // Start recording
      setIsRecording(true);
      setIsPreviewPlaying(false);
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      setRecordedPoseSequence([0]); // Start with first pose
      setReplayingTake(null);
    }
  };

  const handleDeleteTake = (takeId: string) => {
    setTakes(takes.filter(t => t.id !== takeId));
    if (selectedTake === takeId) {
      setSelectedTake(null);
    }
    if (replayingTake === takeId) {
      setReplayingTake(null);
    }
  };

  const handleReplayTake = (takeId: string) => {
    if (isRecording || isPreviewPlaying) return;
    
    if (replayingTake === takeId) {
      // Stop replay
      setReplayingTake(null);
      setCurrentPose(0);
    } else {
      // Start replay
      setReplayingTake(takeId);
      setSelectedTake(takeId);
    }
  };

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
        <h2 className="text-white" style={{ fontSize: '18px' }}>Dance Mode</h2>
        <div className="w-6" />
      </div>

      {/* Camera Preview */}
      <div className="absolute top-28 left-6 right-6" style={{ height: '320px' }}>
        <motion.div
          className="relative w-full h-full bg-[#121212] rounded-2xl overflow-hidden border-2"
          animate={{
            borderColor: isRecording ? ['#FF0050', '#00F5FF', '#FF0050'] : replayingTake ? '#00F5FF' : '#1f2937',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Camera placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600" style={{ fontSize: '14px' }}>Camera Preview</p>
          </div>

          {/* Ghost Dancer Overlay */}
          <AnimatePresence mode="wait">
            <motion.svg 
              key={currentPose}
              className="absolute inset-0 w-full h-full opacity-40" 
              viewBox="0 0 300 350"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.g
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(0, 245, 255, 0.6))',
                    'drop-shadow(0 0 12px rgba(0, 245, 255, 0.8))',
                    'drop-shadow(0 0 8px rgba(0, 245, 255, 0.6))',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {/* Head */}
                <circle cx="150" cy={dancePoses[currentPose].headY} r="18" fill="none" stroke="#00F5FF" strokeWidth="2.5" />
                {/* Body */}
                <line x1="150" y1={dancePoses[currentPose].headY + 18} x2="150" y2="200" stroke="#00F5FF" strokeWidth="2.5" />
                {/* Arms */}
                <line x1="150" y1="150" x2={dancePoses[currentPose].armLeft.x2} y2={dancePoses[currentPose].armLeft.y2} stroke="#00F5FF" strokeWidth="2.5" />
                <line x1="150" y1="150" x2={dancePoses[currentPose].armRight.x2} y2={dancePoses[currentPose].armRight.y2} stroke="#00F5FF" strokeWidth="2.5" />
                {/* Legs */}
                <line x1="150" y1="200" x2={dancePoses[currentPose].legLeft.x2} y2={dancePoses[currentPose].legLeft.y2} stroke="#00F5FF" strokeWidth="2.5" />
                <line x1="150" y1="200" x2={dancePoses[currentPose].legRight.x2} y2={dancePoses[currentPose].legRight.y2} stroke="#00F5FF" strokeWidth="2.5" />
              </motion.g>
              
              {/* Pose Label */}
              <text 
                x="150" 
                y="250" 
                textAnchor="middle" 
                fill="#00F5FF" 
                fontSize="14"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}
              >
                {dancePoses[currentPose].name}
              </text>
            </motion.svg>
          </AnimatePresence>

          {/* Status overlay */}
          <div className="absolute top-4 left-4 right-4">
            {isRecording ? (
              <motion.div 
                className="bg-[#FF0050]/90 rounded-lg px-4 py-2 flex items-center justify-center space-x-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <p className="text-white" style={{ fontSize: '14px' }}>Recording: {formatDuration(recordingDuration)}</p>
              </motion.div>
            ) : replayingTake ? (
              <motion.div 
                className="bg-[#00F5FF]/90 rounded-lg px-4 py-2 flex items-center justify-center space-x-2"
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Volume2 className="w-4 h-4 text-black" />
                <p className="text-black" style={{ fontSize: '14px' }}>Replaying Take</p>
              </motion.div>
            ) : isPreviewPlaying ? (
              <div className="bg-[#00F5FF]/90 rounded-lg px-4 py-2">
                <p className="text-black text-center" style={{ fontSize: '14px' }}>Preview Playing</p>
              </div>
            ) : (
              <div className="bg-black/70 rounded-lg px-4 py-2">
                <p className="text-white text-center" style={{ fontSize: '14px' }}>Ready to Preview or Record</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Preview/Stop Controls */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          <motion.button
            onClick={handlePreviewToggle}
            disabled={isRecording || !!replayingTake}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#121212] border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: isPreviewPlaying ? '#00F5FF' : '#1f2937',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isPreviewPlaying ? (
              <>
                <Square className="w-4 h-4" style={{ color: '#00F5FF' }} />
                <span className="text-white" style={{ fontSize: '14px' }}>Stop Preview</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white" />
                <span className="text-white" style={{ fontSize: '14px' }}>Preview</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Record Button - Moved down */}
      <div className="absolute top-[500px] left-0 right-0 px-6">
        <div className="flex flex-col items-center">
          <motion.button
            onClick={handleRecordToggle}
            disabled={!!replayingTake}
            className="relative w-20 h-20 rounded-full bg-[#121212] flex items-center justify-center disabled:opacity-50"
            style={{
              border: `4px solid ${isRecording ? '#FF0050' : 'rgba(255, 0, 80, 0.5)'}`,
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: isRecording
                ? ['0 0 0 0 rgba(255, 0, 80, 0.7)', '0 0 0 20px rgba(255, 0, 80, 0)', '0 0 0 0 rgba(255, 0, 80, 0.7)']
                : 'none',
            }}
            transition={isRecording ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
          >
            <div 
              className="transition-all duration-300"
              style={{
                width: isRecording ? '28px' : '48px',
                height: isRecording ? '28px' : '48px',
                background: '#FF0050',
                borderRadius: isRecording ? '4px' : '50%',
              }}
            />
          </motion.button>
          <p 
            className="text-xs mt-2 transition-colors duration-300"
            style={{
              color: isRecording ? '#FF0050' : '#6b7280',
              fontSize: '14px',
            }}
          >
            {isRecording ? 'Recording...' : 'Tap to Record'}
          </p>
        </div>
      </div>

      {/* Takes List */}
      <div className="absolute top-[600px] bottom-20 left-6 right-6 overflow-hidden">
        <h3 className="text-white mb-3" style={{ fontSize: '18px' }}>Takes ({takes.length})</h3>
        <div className="space-y-2 overflow-y-auto max-h-[150px]">
          {takes.length === 0 ? (
            <p className="text-gray-500 text-center py-4" style={{ fontSize: '14px' }}>
              No takes recorded yet
            </p>
          ) : (
            takes.map((take) => (
              <motion.div
                key={take.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#121212] rounded-xl p-3 border-2"
                style={{
                  borderColor: replayingTake === take.id ? '#00F5FF' : selectedTake === take.id ? '#00F5FF' : '#1f2937',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="text-white" style={{ fontSize: '14px' }}>
                        Duration: {formatDuration(take.duration)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400" style={{ fontSize: '12px' }}>
                      <span>Last: {take.lastMove}</span>
                      <span>•</span>
                      <span>{take.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleReplayTake(take.id)}
                      disabled={isRecording || isPreviewPlaying}
                      className="p-2 rounded-lg bg-[#00F5FF]/20 hover:bg-[#00F5FF]/30 transition-colors disabled:opacity-50"
                      whileTap={{ scale: 0.9 }}
                    >
                      {replayingTake === take.id ? (
                        <Square className="w-4 h-4" style={{ color: '#00F5FF' }} />
                      ) : (
                        <RotateCcw className="w-4 h-4" style={{ color: '#00F5FF' }} />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteTake(take.id)}
                      className="p-2 rounded-lg bg-[#FF0050]/20 hover:bg-[#FF0050]/30 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#FF0050' }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Publish Button */}
      <div className="absolute bottom-4 left-6 right-6">
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onPublish}
            disabled={takes.length === 0}
            className="w-full h-12 rounded-xl text-white disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
              boxShadow: takes.length > 0 ? '0 4px 20px rgba(0, 245, 255, 0.4)' : 'none',
              fontSize: '16px',
            }}
          >
            Publish {takes.length > 0 && `(${takes.length} ${takes.length === 1 ? 'Take' : 'Takes'})`}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
