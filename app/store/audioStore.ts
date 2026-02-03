// app/store/audioStore.ts

/**
 * Zustand store for audio settings
 * Separated from calculator store so volume persists
 * across calculator types
 */

import { create } from 'zustand';

interface AudioState {
  volume: number;        // 0 to 1
  isMuted: boolean;

  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  volume: 0.5,
  isMuted: false,

  setVolume: (volume: number) => {
    set({ volume: Math.min(1, Math.max(0, volume)) });
    if (volume === 0) {
      set({ isMuted: true });
    } else {
      set({ isMuted: false });
    }
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    set({ isMuted: !isMuted });
  },
}));