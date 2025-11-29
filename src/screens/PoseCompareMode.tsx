import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface PoseCompareModeProps {
  onBack: () => void;
}

// Simplified pose comparison (without TensorFlow for now)
// In production, integrate @tensorflow-models/pose-detection
export default function PoseCompareMode({ onBack }: PoseCompareModeProps) {
  const [similarity, setSimilarity] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
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

  const handleStartDetection = () => {
    setIsDetecting(true);
    // Simulate pose detection (replace with real TensorFlow in production)
    const interval = setInterval(() => {
      // Mock similarity score (0-100)
      const mockScore = Math.floor(Math.random() * 30) + 70;
      setSimilarity(mockScore);
    }, 500);

    return () => clearInterval(interval);
  };

  const getScoreColor = () => {
    if (similarity >= 80) return '#00F5FF';
    if (similarity >= 60) return '#FFD700';
    return '#FF0050';
  };

  const getScoreLabel = () => {
    if (similarity >= 80) return 'Excellent!';
    if (similarity >= 60) return 'Good';
    return 'Keep Practicing';
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Pose Compare</h2>
        <div className="w-6" />
      </div>

      {/* Camera Preview */}
      <div className="absolute top-28 left-6 right-6" style={{ height: '400px' }}>
        <div className="relative w-full h-full bg-[#121212] rounded-2xl overflow-hidden border-2 border-gray-800">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Similarity Score Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-black/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Similarity Score</span>
                <span 
                  className="text-2xl font-bold"
                  style={{ color: getScoreColor() }}
                >
                  {similarity}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getScoreColor() }}
                  initial={{ width: 0 }}
                  animate={{ width: `${similarity}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-sm mt-2" style={{ color: getScoreColor() }}>
                {getScoreLabel()}
              </p>
            </div>
          </div>

          {/* Joint Indicators (Mock) */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-white">Left Arm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-white">Right Leg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-[500px] left-6 right-6">
        <Button
          onClick={() => {
            if (isDetecting) {
              setIsDetecting(false);
            } else {
              handleStartDetection();
            }
          }}
          className="w-full h-12 rounded-xl text-white"
          style={{
            background: isDetecting 
              ? 'linear-gradient(135deg, #FF0050 0%, #E00040 100%)'
              : 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
          }}
        >
          <Target className="w-4 h-4 mr-2" />
          {isDetecting ? 'Stop Detection' : 'Start Detection'}
        </Button>

        <div className="mt-4 bg-[#121212] rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-2">Tips:</p>
          <ul className="text-gray-500 text-xs space-y-1 list-disc list-inside">
            <li>Follow the ghost dancer's movements</li>
            <li>Keep your joints aligned with the target pose</li>
            <li>Aim for 80%+ similarity score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

