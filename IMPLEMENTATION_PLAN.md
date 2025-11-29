# Implementation Plan - TikTok Creator Hub Enhanced Features

## 📁 NEW FILES TO CREATE

### Directories
- `public/audio/` - Audio files folder
- `public/animations/` - Lottie animation files folder
- `src/hooks/` - Custom React hooks
- `src/screens/` - Screen components
- `src/utils/` - Utility functions

### Audio Files (Placeholders)
- `public/audio/greedy.mp3`
- `public/audio/woman.mp3`
- `public/audio/trend1.mp3`
- `public/audio/renai.mp3`

### Animation Files (Placeholders)
- `public/animations/hiphop.json`
- `public/animations/shuffle.json`
- `public/animations/hiphop_intro.json`
- `public/animations/hiphop_chorus.json`
- `public/animations/hiphop_end.json`

### Hooks
- `src/hooks/useAudioPlayer.ts` - Audio playback control
- `src/hooks/useBeatSync.ts` - Beat synchronization logic
- `src/hooks/usePoseDetection.ts` - TensorFlow MoveNet integration
- `src/hooks/useVideoProcessing.ts` - Video filter/overlay processing

### Screens
- `src/screens/TrainingMode.tsx` - Segmented practice mode
- `src/screens/PoseCompareMode.tsx` - AI pose comparison mode

### Components
- `src/components/MusicSelector.tsx` - Music selection menu
- `src/components/LottieGhost.tsx` - Lottie animation wrapper
- `src/components/BeatIndicator.tsx` - Visual beat feedback
- `src/components/VideoFilters.tsx` - Filter selection UI
- `src/components/VideoOverlays.tsx` - Text overlay UI
- `src/components/ModeBottomNav.tsx` - Bottom navigation menu
- `src/components/SegmentProgress.tsx` - Training progress indicator
- `src/components/PoseFeedback.tsx` - Pose comparison visual feedback

### Utilities
- `src/utils/beatMaps.ts` - Hardcoded beat maps per song
- `src/utils/choreography.ts` - Choreography segment definitions
- `src/utils/videoProcessor.ts` - Canvas-based video processing
- `src/utils/poseUtils.ts` - Pose comparison calculations

## 📝 FILES TO MODIFY

### Core App Files
- `src/App.tsx`
  - Add new screen routes (training, poseCompare)
  - Add mode state management
  - Update navigation structure

### Existing Components
- `src/components/DanceMode.tsx`
  - Add music player integration
  - Replace SVG ghost with Lottie component
  - Integrate beat-sync hook
  - Add music toggle button
  - Add preview dance mode
  - Add glow/outline effects

- `src/components/PublishedTakes.tsx`
  - Add filter/overlay selection before viewing
  - Add export functionality
  - Add video processing pipeline

- `src/components/LoginScreen.tsx`
  - Update to show mode selector or keep simple

### Package Dependencies
- `package.json`
  - Add `lottie-react` for animations
  - Add `@tensorflow-models/pose-detection` for pose detection
  - Add `@tensorflow/tfjs` for TensorFlow core

## 🔑 KEY LOGIC TO ADD

### FEATURE A - Music Support
1. **Audio Player Hook** (`useAudioPlayer.ts`)
   - State: currentTrack, isPlaying, volume
   - Methods: play(), pause(), setTrack(), getCurrentTime()
   - Auto-sync with recording start time

2. **Music Selector Component**
   - Dropdown/popover menu
   - List of 4 songs
   - Persist selection in sessionStorage

3. **Integration in DanceMode**
   - Music toggle button (🎵/🔊)
   - Auto-play on recording start
   - Pause on recording stop
   - Sync audio with video recording

### FEATURE B - Lottie Animations
1. **LottieGhost Component**
   - Load Lottie JSON files dynamically
   - Switch animations based on move/dance
   - Loop smoothly
   - Add glow/outline effects via CSS filters

2. **Animation Mapping**
   - Map dance moves to animation files
   - Support different animations per song

3. **Preview Dance Mode**
   - Play full choreography once
   - Then allow recording

### FEATURE C - Beat Sync
1. **useBeatSync Hook**
   - Listen to audio time updates
   - Compare with beat map
   - Trigger pose/animation switches
   - Threshold-based beat detection

2. **Beat Maps** (`beatMaps.ts`)
   - Hardcoded arrays of beat timestamps per song
   - Format: `{ [songName]: number[] }`

3. **Integration**
   - Works in preview mode
   - Works during recording
   - Visual feedback on beats

### FEATURE D - Training Mode
1. **TrainingMode Screen**
   - Segment-based UI
   - Progress indicator (1/3, 2/3, etc.)
   - Slow playback (0.6x speed)
   - Record per segment
   - Merge segments into final take

2. **Choreography Structure** (`choreography.ts`)
   - Define segments per song
   - Each segment: name, duration, animation file

3. **Segment Recording**
   - Record each segment separately
   - Store as separate blobs
   - Merge on completion

### FEATURE E - Pose Comparison
1. **usePoseDetection Hook**
   - Initialize TensorFlow MoveNet
   - Process video frames
   - Extract keypoints
   - Return pose data

2. **PoseCompareMode Screen**
   - Side-by-side comparison
   - Real-time similarity score
   - Visual joint indicators
   - Final score and feedback

3. **Pose Utils** (`poseUtils.ts`)
   - Cosine similarity calculation
   - Angle difference computation
   - Keypoint comparison

### FEATURE F - UI/UX Polish
1. **ModeBottomNav Component**
   - Bottom navigation bar
   - Icons for: Dance, Train, Compare, Takes
   - Active state highlighting
   - Smooth transitions

2. **Design System**
   - Black background
   - Neon pink accents (#FF0050)
   - Light glow effects
   - Mobile-first responsive

### FEATURE G - Video Enhancements
1. **Video Processing** (`videoProcessor.ts`)
   - Canvas-based filter application
   - Text overlay rendering
   - Frame-by-frame processing
   - Export to MP4 (720p, 9:16)

2. **Filters**
   - Neon glow (CSS filters + canvas)
   - VHS effect (noise, scanlines)
   - Soft beauty (blur + color adjustment)
   - Color boost (saturation increase)

3. **Export Pipeline**
   - Process video frames
   - Apply filters/overlays
   - Encode to MP4
   - Optional watermark

## 📦 DEPENDENCIES TO ADD

```json
{
  "lottie-react": "^2.4.0",
  "@tensorflow/tfjs": "^4.15.0",
  "@tensorflow-models/pose-detection": "^2.1.1"
}
```

## 🎯 IMPLEMENTATION ORDER

1. **Phase 1: Foundation**
   - Create folder structure
   - Add dependencies
   - Create placeholder files

2. **Phase 2: Music (Feature A)**
   - Audio player hook
   - Music selector
   - Integration in DanceMode

3. **Phase 3: Lottie (Feature B)**
   - LottieGhost component
   - Replace SVG ghost
   - Preview mode

4. **Phase 4: Beat Sync (Feature C)**
   - Beat maps
   - useBeatSync hook
   - Integration

5. **Phase 5: Training Mode (Feature D)**
   - TrainingMode screen
   - Segment logic
   - Merge functionality

6. **Phase 6: Pose Comparison (Feature E)**
   - TensorFlow setup
   - Pose detection hook
   - Comparison UI

7. **Phase 7: UI Polish (Feature F)**
   - Bottom navigation
   - Design updates
   - Transitions

8. **Phase 8: Video Processing (Feature G)**
   - Filter system
   - Overlay system
   - Export pipeline

