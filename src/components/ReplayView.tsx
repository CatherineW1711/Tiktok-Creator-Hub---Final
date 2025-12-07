import { motion } from 'motion/react';
import { ArrowLeft, X, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Take } from './PublishedTakes';

interface ReplayViewProps {
  take: Take;
  onClose: () => void;
  onDelete: () => void;
  onPublish: () => void;
}

// Generate dynamic AI suggestions based on take data
function generateAISuggestions(take: Take): string[] {
  const suggestions: string[] = [];
  const allSuggestions: string[] = [];
  
  // Duration-based suggestions (randomized)
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
  
  // Pose sequence variety suggestions (randomized)
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
  
  // Energy and timing suggestions (randomized)
  const energyTips = [
    'Keep practicing to perfect your timing and energy!',
    'Great energy! Try matching your movements to the beat more closely.',
    'Your enthusiasm shows! Work on syncing with the music rhythm.',
    'Excellent performance! Consider adding more dramatic pauses.',
    'Good flow! Try varying your movement speed for more impact.',
    'Nice work! Focus on hitting the beats more precisely.',
  ];
  allSuggestions.push(...energyTips);
  
  // Technique suggestions (randomized)
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

export default function ReplayView({ take, onClose, onDelete, onPublish }: ReplayViewProps) {
  const suggestions = generateAISuggestions(take);

  return (
    <div className="relative w-full h-full bg-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 pt-12 pb-4 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <button onClick={onClose} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white" style={{ fontSize: '18px' }}>Replay</h2>
        <div className="w-6" />
      </div>

      {/* Video Player - Full width, 9:16 aspect ratio (portrait) */}
      <div className="w-full px-6 pt-6">
        <div 
          className="relative w-full bg-black rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '9/16', // Portrait for TikTok
            minHeight: '350px',
          }}
        >
          <video
            src={take.blobUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            style={{
              backgroundColor: '#000',
            }}
          />
        </div>
      </div>

      {/* AI Suggestions Card - Below video */}
      {suggestions.length > 0 && (
        <div className="px-6 pt-6">
          <div
            className="w-full rounded-2xl p-5"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 245, 255, 0.2)',
            }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#00F5FF]" />
              <h3 className="text-white font-semibold" style={{ fontSize: '16px' }}>
                AI Suggestions
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <p 
                    className="text-white leading-relaxed"
                    style={{ 
                      fontSize: '15px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    • {suggestion}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pt-6 pb-8 space-y-3">
        <Button
          onClick={onPublish}
          className="w-full text-white"
          style={{
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
            boxShadow: '0 4px 20px rgba(0, 245, 255, 0.4)',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Publish
        </Button>

        <Button
          onClick={onDelete}
          className="w-full text-white bg-[#121212] border-2 border-[#FF0050]/50 hover:border-[#FF0050] transition-colors"
          style={{
            height: '56px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}

