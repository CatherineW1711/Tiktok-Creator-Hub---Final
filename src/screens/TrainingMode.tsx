import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Square, RotateCcw, Check, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { choreography, ChoreographySegment } from '../utils/choreography';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AnimatedGhost from '../components/AnimatedGhost';
import { Take } from '../components/PublishedTakes';

interface TrainingModeProps {
  onBack: () => void;
  takes: Take[];
  setTakes: React.Dispatch<React.SetStateAction<Take[]>>;
  currentSongId?: string;
}

export default function TrainingMode({ onBack, takes, setTakes, currentSongId = 'greedy' }: TrainingModeProps) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSegments, setRecordedSegments] = useState<Blob[]>([]);
  const [watchProgress, setWatchProgress] = useState(0);
  
  const audioPlayer = useAudioPlayer();
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const watchTimerRef = useRef<number | null>(null);

  const segments = choreography[currentSongId] || choreography.greedy;
  const currentSegmentData = segments[currentSegment];
  const progress = ((currentSegment + 1) / segments.length) * 100;

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleWatchSegment = () => {
    setIsWatching(true);
    setWatchProgress(0);
    
    // Simulate watching at 0.6x speed
    const duration = currentSegmentData.duration / 0.6;
    const interval = 100;
    const increment = (interval / duration) * 100;
    
    watchTimerRef.current = window.setInterval(() => {
      setWatchProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          if (watchTimerRef.current) {
            clearInterval(watchTimerRef.current);
          }
          setIsWatching(false);
          return 100;
        }
        return next;
      });
    }, interval);
  };

  const handleStartRecording = () => {
    if (!streamRef.current) {
      alert('Camera not available');
      return;
    }

    try {
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm') 
        ? 'video/webm' 
        : 'video/mp4';

      const recorder = new MediaRecorder(streamRef.current, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedSegments(prev => [...prev, blob]);
      };

      recorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const handleStopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNextSegment = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(prev => prev + 1);
      setWatchProgress(0);
    }
  };

  const handleRedoSegment = () => {
    setRecordedSegments(prev => {
      const newSegments = [...prev];
      newSegments[currentSegment] = undefined as any;
      return newSegments.filter(Boolean);
    });
    setWatchProgress(0);
  };

  const handleMergeAndSave = async () => {
    if (recordedSegments.length !== segments.length) {
      alert('Please record all segments first');
      return;
    }

    // Simple merge: concatenate blobs (in production, use proper video merging)
    const mergedBlob = new Blob(recordedSegments, { type: 'video/webm' });
    const blobUrl = URL.createObjectURL(mergedBlob);
    
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
    
    const newTake: Take = {
      id: Date.now().toString(),
      duration: totalDuration,
      lastMove: 'Training Complete',
      timestamp: timestamp,
      createdAt: now.toLocaleString(),
      poseSequence: [],
      blobUrl: blobUrl,
    };

    setTakes(prev => [newTake, ...prev]);
    setRecordedSegments([]);
    setCurrentSegment(0);
    alert('Training complete! Take saved.');
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Training Mode</h2>
        <div className="w-6" />
      </div>

      {/* Progress */}
      <div className="absolute top-28 left-6 right-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm">
              Segment {currentSegment + 1} / {segments.length}
            </p>
            <p className="text-gray-400 text-xs">{Math.round(progress)}% Complete</p>
          </div>
          <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF0050] to-[#00F5FF]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Segment Info */}
        <div className="bg-[#121212] rounded-xl p-4 mb-4">
          <h3 className="text-white text-lg mb-2">{currentSegmentData.name}</h3>
          <p className="text-gray-400 text-sm">Duration: {currentSegmentData.duration}s</p>
        </div>

        {/* Preview Area */}
        <div className="relative w-full bg-[#121212] rounded-2xl overflow-hidden" style={{ height: '300px' }}>
          {isWatching ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatedGhost
                poseName={currentSegmentData.name}
                beatActive={false}
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00F5FF]"
                    animate={{ width: `${watchProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Preview will appear here</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-2">
          {!isWatching && !isRecording && (
            <Button
              onClick={handleWatchSegment}
              className="w-full h-12 rounded-xl text-white bg-[#00F5FF] hover:bg-[#00D4E6]"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Segment (0.6x Speed)
            </Button>
          )}

          {isWatching && (
            <Button
              onClick={() => {
                if (watchTimerRef.current) {
                  clearInterval(watchTimerRef.current);
                }
                setIsWatching(false);
                setWatchProgress(0);
              }}
              className="w-full h-12 rounded-xl text-white bg-gray-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Preview
            </Button>
          )}

          {!isRecording && !isWatching && (
            <Button
              onClick={handleStartRecording}
              className="w-full h-12 rounded-xl text-white bg-[#FF0050] hover:bg-[#E00040]"
            >
              <Camera className="w-4 h-4 mr-2" />
              Record This Segment
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={handleStopRecording}
              className="w-full h-12 rounded-xl text-white bg-[#FF0050]"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={handleRedoSegment}
            disabled={currentSegment === 0 && recordedSegments.length === 0}
            className="flex-1 h-10 rounded-xl text-white bg-[#121212] border-2 border-gray-700 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Redo
          </Button>
          {currentSegment < segments.length - 1 ? (
            <Button
              onClick={handleNextSegment}
              className="flex-1 h-10 rounded-xl text-white bg-[#00F5FF]"
            >
              Next Segment
            </Button>
          ) : (
            <Button
              onClick={handleMergeAndSave}
              disabled={recordedSegments.length !== segments.length}
              className="flex-1 h-10 rounded-xl text-white bg-gradient-to-r from-[#FF0050] to-[#00F5FF] disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Training
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

