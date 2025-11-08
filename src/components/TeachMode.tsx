import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import BottomNav from './BottomNav';

interface TeachModeProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onPublish: () => void;
}

export default function TeachMode({ onBack, onNavigate, onPublish }: TeachModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState([0]);

  const steps = [
    {
      title: 'Step 1: Key Concepts',
      content: "Let's break down the theme and introduce the main idea...",
      icon: '💡',
    },
    {
      title: 'Step 2: Demonstration',
      content: 'Watch carefully as I demonstrate the technique step by step...',
      icon: '👀',
    },
    {
      title: 'Step 3: Practice',
      content: 'Now try it yourself! Remember the key points we discussed...',
      icon: '✨',
    },
  ];

  const handlePrev = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    setProgress([(newStep / (steps.length - 1)) * 100]);
  };

  const handleNext = () => {
    const newStep = Math.min(steps.length - 1, currentStep + 1);
    setCurrentStep(newStep);
    setProgress([(newStep / (steps.length - 1)) * 100]);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Teach Mode</h2>
        <div className="w-6" />
      </div>

      {/* Camera Preview */}
      <div className="absolute top-28 left-6 right-20 h-64">
        <motion.div
          className="relative w-full h-full bg-[#121212] rounded-2xl overflow-hidden border-2 border-gray-800"
          animate={{
            borderColor: isRecording ? ['#FF0050', '#00F5FF', '#FF0050'] : '#1f2937',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600">Your face appears here</p>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <motion.div
              className="absolute top-4 left-4 flex items-center space-x-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-3 h-3 rounded-full bg-[#FF0050]" />
              <span className="text-white text-sm">Recording</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Step Icons (Right Side) */}
      <div className="absolute top-28 right-6 flex flex-col space-y-3">
        {steps.map((step, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
              index === currentStep 
                ? 'bg-[#00F5FF] border-2 border-white' 
                : 'bg-[#1a1a1a] border border-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`text-xl ${index === currentStep ? 'grayscale-0' : 'grayscale opacity-50'}`}>
              {step.icon}
            </span>
            <span className={`text-xs mt-1 ${index === currentStep ? 'text-black' : 'text-gray-500'}`}>
              {index + 1}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Cue Cards Area */}
      <div className="absolute top-[400px] left-6 right-6">
        <div className="bg-[#121212] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-white disabled:text-gray-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-[#FF0050]' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="text-white disabled:text-gray-700"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{steps[currentStep].icon}</div>
              <h3 className="text-white mb-2">{steps[currentStep].title}</h3>
              <p className="text-gray-400 text-sm">{steps[currentStep].content}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-xs">Progress</span>
              <div className="flex-1">
                <Slider
                  value={progress}
                  onValueChange={(value) => {
                    setProgress(value);
                    const stepIndex = Math.round((value[0] / 100) * (steps.length - 1));
                    setCurrentStep(stepIndex);
                  }}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-[#00F5FF] text-xs">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-28 left-0 right-0 px-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Record Button */}
          <motion.button
            onClick={() => setIsRecording(!isRecording)}
            className="relative w-16 h-16 rounded-full bg-[#121212] border-4 border-[#FF0050] flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <div className={`w-10 h-10 rounded-full ${isRecording ? 'bg-white' : 'bg-[#FF0050]'}`} />
          </motion.button>

          {/* Publish Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onPublish}
              className="px-6 py-6 rounded-xl text-white"
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
