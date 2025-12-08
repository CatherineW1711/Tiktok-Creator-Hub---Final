import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Square, Trash2, RotateCcw, Volume2, Camera, CameraOff, VolumeX, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Take } from './PublishedTakes';
import ReplayView from './ReplayView';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useBeatSync } from '../hooks/useBeatSync';
import MusicSelector from './MusicSelector';
import AnimatedGhost, { getChoreographyPattern } from './AnimatedGhost';
import { availableSongs } from '../utils/beatMaps';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Generate AI suggestions for a take - called once when video is recorded
function generateAISuggestions(take: Take): string[] {
  const allSuggestions: string[] = [];
  
  // Duration-based suggestions
  const durationTips = [
    'Try recording for longer to capture more moves.',
    'Great length! Consider breaking into shorter segments for better engagement.',
    'Perfect timing! Your video length is ideal for TikTok.',
    'Consider varying your recording length for different content styles.',
  ];
  if (take.duration < 5) {
    allSuggestions.push(durationTips[0]);
  } else if (take.duration > 30) {
    allSuggestions.push(durationTips[1]);
  } else {
    allSuggestions.push(durationTips[2]);
  }
  
  // Pose sequence variety suggestions
  const varietyTips = [
    'Add more variety — try incorporating different poses throughout your dance.',
    'Excellent pose variety! Your transitions are smooth.',
    'Mix up your moves — try adding more dynamic transitions.',
    'Great choreography! Consider adding more complex combinations.',
    'Your pose variety is good — experiment with faster transitions.',
  ];
  if (take.poseSequence.length < 3) {
    allSuggestions.push(varietyTips[0]);
  } else if (take.poseSequence.length < 5) {
    allSuggestions.push(varietyTips[2]);
  } else {
    allSuggestions.push(varietyTips[1]);
  }
  
  // Energy and timing suggestions
  const energyTips = [
    'Keep practicing to perfect your timing and energy!',
    'Great energy! Try matching your movements to the beat more closely.',
    'Your enthusiasm shows! Work on syncing with the music rhythm.',
    'Excellent performance! Consider adding more dramatic pauses.',
    'Good flow! Try varying your movement speed for more impact.',
    'Nice work! Focus on hitting the beats more precisely.',
  ];
  allSuggestions.push(...energyTips);
  
  // Technique suggestions
  const techniqueTips = [
    'Try extending your arms fully for more dramatic movements.',
    'Great form! Consider adding more body isolation moves.',
    'Work on your footwork — try more varied leg positions.',
    'Excellent posture! Keep your core engaged throughout.',
    'Try adding more upper body movement to complement your steps.',
  ];
  allSuggestions.push(...techniqueTips);
  
  // Randomly select exactly 2 unique suggestions
  const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 2);
  
  return selected;
}

interface DanceModeProps {
  onBack: () => void;
  onPublish: () => void;
  onViewTakes: () => void;
  takes: Take[];
  setTakes: React.Dispatch<React.SetStateAction<Take[]>>;
}

type FacingMode = 'user' | 'environment';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Enhanced dance poses with more distinct movements
const dancePoses = [
  { 
    id: 1, 
    name: 'Neutral', 
    headY: 120, 
    armLeft: { x2: 120, y2: 190 }, 
    armRight: { x2: 180, y2: 190 }, 
    legLeft: { x2: 130, y2: 280 }, 
    legRight: { x2: 170, y2: 280 } 
  },
  { 
    id: 2, 
    name: 'Arm Wave', 
    headY: 110, 
    armLeft: { x2: 100, y2: 140 },  // Left arm raised high
    armRight: { x2: 200, y2: 140 },  // Right arm raised high
    legLeft: { x2: 130, y2: 280 }, 
    legRight: { x2: 170, y2: 280 } 
  },
  { 
    id: 3, 
    name: 'Leg Lift', 
    headY: 115, 
    armLeft: { x2: 125, y2: 180 }, 
    armRight: { x2: 175, y2: 180 }, 
    legLeft: { x2: 130, y2: 280 }, 
    legRight: { x2: 160, y2: 240 }  // Right leg lifted high
  },
  { 
    id: 4, 
    name: 'Arm Cross', 
    headY: 120, 
    armLeft: { x2: 180, y2: 170 },  // Left arm crossed to right
    armRight: { x2: 120, y2: 170 },  // Right arm crossed to left
    legLeft: { x2: 125, y2: 285 }, 
    legRight: { x2: 175, y2: 285 } 
  },
  { 
    id: 5, 
    name: 'Jump Pose', 
    headY: 100,  // Head higher (jumping)
    armLeft: { x2: 110, y2: 150 },  // Both arms up
    armRight: { x2: 190, y2: 150 }, 
    legLeft: { x2: 140, y2: 260 },  // Legs spread wider
    legRight: { x2: 160, y2: 260 } 
  },
];

export default function DanceMode({ onBack, onPublish, onViewTakes, takes, setTakes }: DanceModeProps) {
  // Local takes state for current session - separate from Published Takes
  const [localTakes, setLocalTakes] = useState<Take[]>([]);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPose, setCurrentPose] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedTake, setSelectedTake] = useState<string | null>(null);
  const [recordedPoseSequence, setRecordedPoseSequence] = useState<number[]>([]);
  const [musicMuted, setMusicMuted] = useState(false);
  const [showReplayView, setShowReplayView] = useState(false);
  const [replayTake, setReplayTake] = useState<Take | null>(null);
  const [beatActive, setBeatActive] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    const saved = sessionStorage.getItem('danceDifficulty');
    return (saved as DifficultyLevel) || 'medium';
  });

  // Save difficulty to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('danceDifficulty', difficulty);
  }, [difficulty]);
  
  // Audio player
  const audioPlayer = useAudioPlayer();
  
  // Get current choreography pattern based on song
  const currentChoreography = audioPlayer.currentTrack 
    ? getChoreographyPattern(audioPlayer.currentTrack.id)
    : getChoreographyPattern('greedy');
  
  // Filter choreography based on difficulty - simpler moves for Easy
  const getFilteredChoreography = (choreography: string[]): string[] => {
    // Simple poses suitable for beginners
    const simplePoses = ['Neutral', 'Gentle Sway', 'Arm Wave', 'Hip Sway'];
    // Moderate poses - exclude complex ones
    const moderatePoses = ['Neutral', 'Gentle Sway', 'Arm Wave', 'Hip Sway', 'Side Step', 'Arm Flow', 'Torso Twist'];
    
    switch (difficulty) {
      case 'easy':
        // Easy: Only simple, basic movements
        return choreography.filter(pose => simplePoses.includes(pose));
      case 'medium':
        // Medium: Moderate movements, no rapid/complex transitions
        return choreography.filter(pose => moderatePoses.includes(pose));
      case 'hard':
        // Hard: All poses including complex ones
        return choreography;
      default:
        return choreography;
    }
  };

  // Get filtered choreography for current difficulty
  const filteredChoreography = getFilteredChoreography(currentChoreography);
  
  // Map pose index to choreography pose name (using filtered choreography)
  const getCurrentPoseName = () => {
    if (filteredChoreography.length === 0) {
      return 'Neutral'; // Fallback if all poses filtered out
    }
    return filteredChoreography[currentPose % filteredChoreography.length];
  };

  // Get animation speed based on difficulty - increased contrast
  const getAnimationSpeed = () => {
    switch (difficulty) {
      case 'easy':
        return 0.5; // Significantly slower (50% speed) for beginners
      case 'medium':
        return 0.85; // Slightly faster than Easy, moderate pace
      case 'hard':
        return 2.0; // Very fast and challenging (200% speed) - maximum difficulty
      default:
        return 1.0;
    }
  };

  // Get transition duration based on difficulty
  const getTransitionDuration = () => {
    const baseDuration = 0.4;
    const speed = getAnimationSpeed();
    return baseDuration / speed;
  };
  
  // Load saved track from sessionStorage
  useEffect(() => {
    const savedTrackId = sessionStorage.getItem('selectedTrack');
    if (savedTrackId) {
      const track = availableSongs.find((s) => s.id === savedTrackId);
      if (track) {
        audioPlayer.setTrack(track);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Save track selection
  useEffect(() => {
    if (audioPlayer.currentTrack) {
      sessionStorage.setItem('selectedTrack', audioPlayer.currentTrack.id);
    }
  }, [audioPlayer.currentTrack]);
  
  // Beat sync - switch pose on beat using song-specific choreography
  // For Easy mode, skip some beats to slow down pose changes
  const beatSkipRef = useRef(0);
  useBeatSync({
    currentTime: audioPlayer.currentTime,
    songId: audioPlayer.currentTrack?.id || null,
    onBeat: () => {
      // Pulse effect on beat
      setBeatActive(true);
      setTimeout(() => setBeatActive(false), 200);
      
      if (isRecording || isPreviewPlaying) {
        // Easy mode: only switch pose every 2 beats (slower tempo)
        // Medium mode: switch every beat (normal)
        // Hard mode: switch every beat, and sometimes twice per beat for extra challenge
        let shouldSwitchPose = false;
        
        if (difficulty === 'easy') {
          shouldSwitchPose = beatSkipRef.current % 2 === 0; // Every 2nd beat for Easy
        } else if (difficulty === 'hard') {
          // Hard mode: switch on every beat, and sometimes twice for rapid changes
          shouldSwitchPose = true;
          // Occasionally switch twice per beat for extra challenge (20% chance)
          if (Math.random() < 0.2 && beatSkipRef.current > 0) {
            setCurrentPose((prev) => {
              const nextPose = (prev + 1) % filteredChoreography.length;
              if (isRecording) {
                setRecordedPoseSequence((seq) => [...seq, nextPose]);
              }
              return nextPose;
            });
          }
        } else {
          // Medium mode: switch every beat (normal)
          shouldSwitchPose = true;
        }
        
        beatSkipRef.current += 1;
        
        if (shouldSwitchPose) {
          setCurrentPose((prev) => {
            const nextPose = (prev + 1) % filteredChoreography.length;
            if (isRecording) {
              setRecordedPoseSequence((seq) => [...seq, nextPose]);
            }
            return nextPose;
          });
        }
      }
    },
  });
  
  // Update choreography when song or difficulty changes
  useEffect(() => {
    if (audioPlayer.currentTrack || difficulty) {
      setCurrentPose(0); // Reset to first pose when song or difficulty changes
      beatSkipRef.current = 0; // Reset beat skip counter
    }
  }, [audioPlayer.currentTrack, difficulty]);
  
  // Camera state
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const finalDurationRef = useRef<number>(0);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera(); // Stop existing stream first
      setCameraError(null);
      
      const constraints: MediaStreamConstraints = {
        video: { facingMode },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Camera access denied or unavailable');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Preview animation loop
  useEffect(() => {
    if (!isPreviewPlaying || isRecording || showReplayView) return;
    
    const interval = setInterval(() => {
      setCurrentPose((prev) => (prev + 1) % dancePoses.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPreviewPlaying, isRecording, showReplayView]);

  // Recording animation loop
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setCurrentPose((prev) => {
        const nextPose = (prev + 1) % dancePoses.length;
        setRecordedPoseSequence((seq) => [...seq, nextPose]);
        return nextPose;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // Recording duration tracker
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      if (recordingStartTime) {
        const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
        setRecordingDuration(duration);
        finalDurationRef.current = duration; // Store in ref for use in onstop
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);
  
  // Ensure camera video is visible after recording stops
  useEffect(() => {
    if (!isRecording && streamRef.current && videoRef.current) {
      // Reattach stream to video element
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(console.error);
    }
  }, [isRecording]);

  // Old replay functionality removed - now using ReplayView component

  const handlePreviewToggle = () => {
    if (isRecording) return;
    setIsPreviewPlaying(!isPreviewPlaying);
    if (isPreviewPlaying) {
      setCurrentPose(0);
      if (!musicMuted && audioPlayer.currentTrack) {
        audioPlayer.pause();
      }
    } else {
      // Ensure camera is visible when starting preview
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(console.error);
      } else if (!cameraActive) {
        startCamera();
      }
      if (!musicMuted && audioPlayer.currentTrack) {
        audioPlayer.play();
      }
    }
  };

  const startRecording = async () => {
    // Ensure camera stream is active before recording
    if (!streamRef.current || !cameraActive) {
      await startCamera();
      // Wait a bit for camera to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!streamRef.current) {
      alert('Camera not available. Please enable camera access.');
      return;
    }

    try {
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm') 
        ? 'video/webm' 
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : '';

      if (!mimeType) {
        alert('Video recording not supported in this browser');
        return;
      }

      // Ensure video element is showing the stream
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(console.error);
      }

      // Combine camera video stream with BGM audio stream if music is enabled and track is selected
      let combinedStream = streamRef.current;
      
      if (!musicMuted && audioPlayer.currentTrack) {
        const audioElement = audioPlayer.getAudioElement();
        if (audioElement) {
          try {
            // Use captureStream() to get audio from HTMLAudioElement
            const audioStream = (audioElement as any).captureStream 
              ? (audioElement as any).captureStream() 
              : (audioElement as any).mozCaptureStream 
              ? (audioElement as any).mozCaptureStream()
              : null;

            if (audioStream && audioStream.getAudioTracks().length > 0) {
              // Create combined stream with video from camera and audio from BGM
              combinedStream = new MediaStream([
                ...streamRef.current.getVideoTracks(),
                ...audioStream.getAudioTracks(),
              ]);
              console.log('Combined video and audio streams for recording');
            } else {
              console.warn('No audio tracks available from captureStream, recording video only');
            }
          } catch (error) {
            console.warn('Failed to capture audio stream:', error);
            // Continue with video-only recording
          }
        }
      } else {
        console.log('No music selected or muted, recording video only');
      }

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        
        // Use the ref value which captures the latest duration before state reset
        // Fallback to calculated duration if ref is 0
        const finalDuration = finalDurationRef.current > 0 
          ? finalDurationRef.current 
          : (recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 1);
        
        // Reset ref for next recording
        finalDurationRef.current = 0;
        
        // Convert blob to data URL for persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          
          const now = new Date();
          const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          
          // Create take object first
          const takeId = Date.now().toString();
          const newTake: Take = {
            id: takeId,
            duration: finalDuration,
            lastMove: getCurrentPoseName(),
            timestamp: timestamp,
            createdAt: now.toLocaleString(),
            poseSequence: recordedPoseSequence,
            blobUrl: dataUrl, // Store as data URL for persistence
            // Store music metadata if a track was selected
            songId: audioPlayer.currentTrack?.id,
            songName: audioPlayer.currentTrack?.name,
          };

          // Generate AI suggestions once when video is recorded (using the take object)
          const aiSuggestions = generateAISuggestions(newTake);
          
          // Add suggestions to the take
          newTake.aiSuggestions = aiSuggestions;

          // Add to local takes (for current session)
          setLocalTakes((prev) => [newTake, ...prev]);
        };
        reader.onerror = () => {
          console.error('Failed to convert blob to data URL');
          // Fallback: use blob URL (won't persist across reloads)
          const blobUrl = URL.createObjectURL(blob);
          const now = new Date();
          const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          
          // Create take object first
          const takeId = Date.now().toString();
          const newTake: Take = {
            id: takeId,
            duration: finalDuration,
            lastMove: getCurrentPoseName(),
            timestamp: timestamp,
            createdAt: now.toLocaleString(),
            poseSequence: recordedPoseSequence,
            blobUrl: blobUrl,
            // Store music metadata if a track was selected
            songId: audioPlayer.currentTrack?.id,
            songName: audioPlayer.currentTrack?.name,
          };

          // Generate AI suggestions once when video is recorded (using the take object)
          const aiSuggestions = generateAISuggestions(newTake);
          
          // Add suggestions to the take
          newTake.aiSuggestions = aiSuggestions;

          // Add to local takes (for current session)
          setLocalTakes((prev) => [newTake, ...prev]);
        };
        reader.readAsDataURL(blob);
      };

        // Start BGM and recording in sync
        if (!musicMuted && audioPlayer.currentTrack) {
          audioPlayer.seek(0); // Reset to beginning
          // Small delay to ensure audio stream is ready
          await new Promise(resolve => setTimeout(resolve, 50));
          await audioPlayer.play(0); // Start playback
          // Small delay to ensure audio is playing before recording starts
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Start recording immediately after BGM starts (or immediately if no music)
        recorder.start(100); // Collect data every 100ms
        setIsRecording(true);
        setIsPreviewPlaying(false);
        const startTime = Date.now();
        setRecordingStartTime(startTime);
        setRecordingDuration(0);
        finalDurationRef.current = 0; // Reset ref
        setRecordedPoseSequence([currentPose]);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingStartTime(null);
    setRecordingDuration(0);
    setRecordedPoseSequence([]);
    setCurrentPose(0);
    
    // Pause music when recording stops
    if (!musicMuted && audioPlayer.currentTrack) {
      audioPlayer.pause();
    }
    
    // Ensure camera stream is still active and visible
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    } else if (!cameraActive) {
      // Restart camera if it was stopped
      startCamera();
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Delete from local takes only (does not affect Published Takes)
  const handleDeleteTake = (takeId: string) => {
    const take = localTakes.find(t => t.id === takeId);
    if (take && take.blobUrl && !take.blobUrl.startsWith('data:')) {
      // Only revoke blob URLs, not data URLs
      URL.revokeObjectURL(take.blobUrl);
    }
    setLocalTakes(localTakes.filter(t => t.id !== takeId));
    if (selectedTake === takeId) {
      setSelectedTake(null);
    }
    if (replayTake?.id === takeId) {
      setReplayTake(null);
      setShowReplayView(false);
    }
  };

  const handleReplayTake = (takeId: string) => {
    if (isRecording || isPreviewPlaying) return;
    
    const take = localTakes.find(t => t.id === takeId);
    if (take) {
      setReplayTake(take);
      setShowReplayView(true);
    }
  };

  const handleCloseReplay = () => {
    setShowReplayView(false);
    setReplayTake(null);
  };

  const handleDeleteFromReplay = () => {
    if (replayTake) {
      handleDeleteTake(replayTake.id);
      setShowReplayView(false);
      setReplayTake(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show replay view if active
  if (showReplayView && replayTake) {
    return (
      <div className="relative w-full h-full bg-black">
        <ReplayView
          take={replayTake}
          onClose={handleCloseReplay}
          onDelete={handleDeleteFromReplay}
          onPublish={onPublish}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Dance Mode</h2>
        <div className="flex items-center space-x-2">
          <MusicSelector 
            currentTrack={audioPlayer.currentTrack}
            onSelectTrack={audioPlayer.setTrack}
          />
          <motion.button
            onClick={() => {
              setMusicMuted(!musicMuted);
              if (!musicMuted) {
                audioPlayer.pause();
              } else {
                if (audioPlayer.currentTrack) {
                  audioPlayer.play();
                }
              }
            }}
            whileTap={{ scale: 0.9 }}
            className="rounded-lg bg-[#121212] border-2 border-gray-700 hover:border-[#FF0050] transition-colors flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
            }}
            title={musicMuted ? 'Unmute Music' : 'Mute Music'}
          >
            {musicMuted ? (
              <VolumeX 
                className="text-[#FF0050]" 
                style={{
                  width: '24px',
                  height: '24px',
                  strokeWidth: 2.5,
                }}
              />
            ) : (
              <Volume2 
                className="text-white" 
                style={{
                  width: '24px',
                  height: '24px',
                  strokeWidth: 2.5,
                }}
              />
            )}
          </motion.button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-1.5 rounded-lg bg-[#121212] border-2 border-gray-700 hover:border-[#FF0050] transition-colors px-3 py-2"
                style={{
                  minHeight: '44px',
                }}
              >
                <span className="text-white text-sm font-medium">
                  {difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'}
                </span>
                <ChevronDown 
                  className="text-white" 
                  style={{
                    width: '16px',
                    height: '16px',
                    strokeWidth: 2.5,
                  }}
                />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-[#1a1a1a] border-gray-700 min-w-[120px]"
              style={{ zIndex: 9999 }}
            >
              <DropdownMenuItem
                onClick={() => setDifficulty('easy')}
                className="text-white hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
              >
                <span className={difficulty === 'easy' ? 'text-[#FF0050] font-semibold' : ''}>
                  Easy
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDifficulty('medium')}
                className="text-white hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
              >
                <span className={difficulty === 'medium' ? 'text-[#FF0050] font-semibold' : ''}>
                  Medium
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDifficulty('hard')}
                className="text-white hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
              >
                <span className={difficulty === 'hard' ? 'text-[#FF0050] font-semibold' : ''}>
                  Hard
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="absolute top-28 left-6 right-6" style={{ height: '320px' }}>
        <motion.div
          className="relative w-full h-full bg-[#121212] rounded-2xl overflow-hidden border-2"
          animate={{
            borderColor: isRecording ? ['#FF0050', '#00F5FF', '#FF0050'] : '#1f2937',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Real Camera Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' }}
          />

          {/* Camera Error Message */}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
              <p className="text-gray-400 text-center px-4" style={{ fontSize: '14px' }}>
                {cameraError}
              </p>
            </div>
          )}

          {/* Camera Toggle Button */}
          <button
            onClick={toggleCamera}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors"
            title={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
          >
            <Camera className="w-5 h-5 text-white" />
          </button>

          {/* Move Description - Above Ghost Figure */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              className="px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentPose}
            >
              <p 
                className="text-white text-center font-bold whitespace-nowrap"
                style={{ 
                  fontSize: '17px',
                  fontWeight: 700,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 245, 255, 0.3)',
                  letterSpacing: '0.5px',
                }}
              >
                {getCurrentPoseName()}
              </p>
            </motion.div>
          </div>

          {/* Ghost Dancer Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ghost-${currentPose}`}
              className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
              style={{
                clipPath: 'inset(60px 0 0 0)', // Clip top 60px to hide anything above status banner
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.85, scale: 1 }} // Increased opacity for better visibility
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: getTransitionDuration(), 
                ease: 'easeOut',
                // Add a slight bounce for better visibility of transitions
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
            >
              <AnimatedGhost
                poseName={getCurrentPoseName()}
                beatActive={beatActive}
                songId={audioPlayer.currentTrack?.id}
                difficulty={difficulty}
                className="w-full h-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Difficulty Label - Above status overlay */}
          <div className="absolute top-2 left-4 z-5">
            <div className="bg-black/80 backdrop-blur-md rounded-lg px-3 py-1.5 border border-gray-700">
              <p className="text-white text-xs font-medium">
                Mode: <span className="text-[#00F5FF] capitalize">{difficulty}</span>
              </p>
            </div>
          </div>

          {/* Status overlay */}
          <div className="absolute top-12 left-4 right-4 z-5">
            {isRecording ? (
              <motion.div 
                className="bg-[#FF0050]/90 rounded-lg px-4 py-2 flex items-center justify-center space-x-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <p className="text-white" style={{ fontSize: '14px' }}>Recording: {formatDuration(recordingDuration)}</p>
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
            disabled={isRecording || showReplayView}
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

      {/* Record Button */}
      <div className="absolute top-[500px] left-0 right-0 px-6">
        <div className="flex flex-col items-center">
          <motion.button
            onClick={handleRecordToggle}
            disabled={showReplayView || !cameraActive}
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

      {/* Takes List - Local takes only (separate from Published Takes) */}
      <div className="absolute top-[600px] bottom-20 left-6 right-6 overflow-hidden">
        <h3 className="text-white mb-3" style={{ fontSize: '18px' }}>Takes ({localTakes.length})</h3>
        <div className="space-y-2 overflow-y-auto max-h-[150px]">
          {localTakes.length === 0 ? (
            <p className="text-gray-500 text-center py-4" style={{ fontSize: '14px' }}>
              No takes recorded yet
            </p>
          ) : (
            localTakes.map((take) => (
              <motion.div
                key={take.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#121212] rounded-xl p-3 border-2"
                style={{
                  borderColor: selectedTake === take.id ? '#00F5FF' : '#1f2937',
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
                      {showReplayView && replayTake?.id === take.id ? (
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

      {/* Publish Button - Moves local takes to Published Takes */}
      <div className="absolute bottom-4 left-6 right-6">
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => {
              // Move all local takes to Published Takes
              if (localTakes.length > 0) {
                setTakes((prev) => [...localTakes, ...prev]);
                setLocalTakes([]); // Clear local takes after publishing
              }
              onPublish();
            }}
            disabled={localTakes.length === 0}
            className="w-full h-12 rounded-xl text-white disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
              boxShadow: localTakes.length > 0 ? '0 4px 20px rgba(0, 245, 255, 0.4)' : 'none',
              fontSize: '16px',
            }}
          >
            Publish {localTakes.length > 0 && `(${localTakes.length} ${localTakes.length === 1 ? 'Take' : 'Takes'})`}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
