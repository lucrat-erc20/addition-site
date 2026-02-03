// app/components/ui/VolumeSlider.tsx

/**
 * Volume slider component
 * Shows speaker icon that changes based on volume level
 * Also serves as ASMR indicator for SEO (labelled in metadata)
 */

'use client';

import { useAudioStore } from '@/store/audioStore';

export default function VolumeSlider() {
  const { volume, isMuted, setVolume, toggleMute } = useAudioStore();

  // Pick icon based on volume level
  const getSpeakerIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 0.33) return '🔉';
    if (volume < 0.66) return '🔊';
    return '🔊';
  };

  return (
    <div className="flex items-center gap-2 px-1">
      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        className="text-sm hover:opacity-70 transition-opacity cursor-pointer"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getSpeakerIcon()}
      </button>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-20 h-1.5 rounded appearance-none cursor-pointer"
        style={{ accentColor: '#6da431' }}
        aria-label="Volume"
      />
    </div>
  );
}