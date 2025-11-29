# Refactoring Summary - Lottie Removal & BGM Recording Fix

## ✅ Changes Completed

### 1️⃣ Removed Lottie Dependency

**Created New Component:**
- `src/components/AnimatedGhost.tsx` - Pure code-driven animated ghost using SVG + Framer Motion

**Key Features:**
- ✅ No external animation files required
- ✅ Vivid silhouette with head, torso, arms, legs (thicker than stick figure)
- ✅ Neon glow effects (cyan/pink)
- ✅ 5 distinct poses matching dancePoses:
  - Neutral
  - Arm Wave
  - Leg Lift
  - Arm Cross
  - Jump Pose
- ✅ Smooth animations with Framer Motion
- ✅ Beat-active pulsing effect
- ✅ Joint glow dots for more vivid appearance

**Removed/Updated:**
- ❌ Removed `LottieGhost` usage from `DanceMode.tsx`
- ❌ Removed `LottieGhost` usage from `TrainingMode.tsx`
- ❌ Removed `getAnimationForMove` import (no longer needed)
- ❌ Removed `useLottie` state variable
- ⚠️ `LottieGhost.tsx` file still exists but is no longer used (can be deleted)

### 2️⃣ Fixed BGM Recording

**Updated Files:**
- `src/hooks/useAudioPlayer.ts` - Added `getAudioElement()` function
- `src/components/DanceMode.tsx` - Combined camera + BGM streams

**Implementation:**
- ✅ Uses `captureStream()` on HTMLAudioElement to capture BGM audio
- ✅ Combines camera video tracks + BGM audio tracks into single MediaStream
- ✅ BGM starts at t=0 when recording begins (synchronized)
- ✅ Recorded videos now include BGM audio track
- ✅ Fallback: If `captureStream()` unavailable, records video only (with warning)

**How It Works:**
```typescript
// Get audio stream from HTMLAudioElement
const audioStream = audioElement.captureStream();

// Combine with camera stream
const combinedStream = new MediaStream([
  ...cameraStream.getVideoTracks(),
  ...audioStream.getAudioTracks(),
]);

// Use combined stream for MediaRecorder
const recorder = new MediaRecorder(combinedStream, { mimeType });
```

## 📁 Files Modified

### New Files
1. **`src/components/AnimatedGhost.tsx`**
   - Pure SVG + Framer Motion ghost animation
   - No dependencies on external files
   - Fully code-driven

### Modified Files
1. **`src/components/DanceMode.tsx`**
   - Replaced `LottieGhost` with `AnimatedGhost`
   - Removed `useLottie` state
   - Added `beatActive` state for pulse effect
   - Updated recording logic to combine streams
   - BGM sync on recording start

2. **`src/hooks/useAudioPlayer.ts`**
   - Added `getAudioElement()` function
   - Exposes audio element for `captureStream()`

3. **`src/screens/TrainingMode.tsx`**
   - Replaced `LottieGhost` with `AnimatedGhost`

### Unused Files (Can Be Deleted)
- `src/components/LottieGhost.tsx` - No longer used
- `src/utils/choreography.ts` - `getAnimationForMove()` no longer needed (but choreography structure still used in TrainingMode)

## 🎨 AnimatedGhost Features

### Pose System
Each pose has detailed configuration:
- Head position and size
- Torso (thick line, 8px width)
- Arms (6-7px width, with rotation)
- Legs (7-8px width, with rotation)
- Body scale (for jump pose)
- Head bob animation

### Visual Effects
- **Neon Glow**: Radial gradient with cyan/pink
- **Drop Shadow**: Multiple layers for depth
- **Joint Dots**: Glowing circles at joints
- **Beat Pulse**: Intensified glow on beat
- **Smooth Transitions**: Framer Motion interpolation

### Animation Details
- Head bobs slightly
- Arms/legs have subtle idle animations
- Body scales on certain poses
- Glow pulses with beat
- Smooth pose transitions (0.4s easeOut)

## 🎵 BGM Recording Details

### Synchronization
1. User clicks "Start Recording"
2. BGM is reset to t=0 (`audioPlayer.seek(0)`)
3. BGM playback starts (`audioPlayer.play()`)
4. MediaRecorder starts immediately after
5. Both streams combined: video from camera + audio from BGM

### Browser Support
- ✅ Chrome/Edge: Full support via `captureStream()`
- ✅ Firefox: Uses `mozCaptureStream()` (fallback)
- ⚠️ Safari: May not support (falls back to video-only)

### Testing
To verify BGM is recorded:
1. Select a song in "Choose Music" menu
2. Start recording
3. Stop recording
4. Play back the take
5. You should hear the BGM synchronized with the video

## 🚀 Usage

### AnimatedGhost Component
```tsx
<AnimatedGhost
  poseName="Arm Wave"  // Must match dancePoses names
  beatActive={true}    // Optional: pulse on beat
  className="w-full h-full"
/>
```

### Beat Sync Integration
The ghost automatically responds to beats:
- `beatActive` prop pulses the ghost
- Pose changes on beat (via `useBeatSync` hook)
- Smooth transitions between poses

## 📝 Notes

1. **No External Assets**: All animations are code-generated
2. **Performance**: SVG + Framer Motion is lightweight and mobile-friendly
3. **Maintainability**: Easy to add new poses by updating `poseConfigs` in `AnimatedGhost.tsx`
4. **BGM Sync**: Critical for beat-sync choreography - BGM must start at t=0

## 🔄 Migration Notes

If you had Lottie JSON files in `public/animations/`, they are no longer needed. The app now works entirely without external animation files.

The ghost is now more vivid and expressive than the previous stick figure, with:
- Thicker limbs (6-8px vs 2.5px)
- Glow effects
- Joint highlights
- Smooth animations
- Beat-responsive pulsing

