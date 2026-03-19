// app/store/sensoryStore.ts

/**
 * Zustand store for the Sensory Drive pedal.
 * Controls power, knob values, cable connections, and active sound pack.
 */

import { create } from 'zustand';

export interface SensoryState {
  // Power
  systemOn: boolean;

  // Knob values 0–100
  volume: number;
  pitch: number;
  tone: number;
  reverb: number;
  drive: number;

  // Cable connections
  // Index maps to CABLES array in SensoryDrive.tsx:
  //   0 = Signal → volume
  //   1 = Drive  → drive
  //   2 = Return → tone
  //   3 = Trig   → reverb
  //   4 = Mod    → pitch
  connected: boolean[];

  // Active sound pack slug — matches folder name under /public/sounds/
  soundPack: string;

  // Actions
  togglePower:  () => void;
  setKnob:      (knob: 'volume' | 'pitch' | 'tone' | 'reverb' | 'drive', value: number) => void;
  toggleCable:  (index: number) => void;
  setSoundPack: (pack: string) => void;
}

export const useSensoryStore = create<SensoryState>((set) => ({
  systemOn:  true,
  volume:    75,
  pitch:     50,
  tone:      60,
  reverb:    20,
  drive:     30,
  connected: [true, true, true, true, true],
  soundPack: 'mechanical-1',

  togglePower: () =>
    set(s => ({ systemOn: !s.systemOn })),

  setKnob: (knob, value) =>
    set({ [knob]: Math.max(0, Math.min(100, value)) }),

  toggleCable: (index) =>
    set(s => {
      const connected = [...s.connected];
      connected[index] = !connected[index];
      return { connected };
    }),

  setSoundPack: (pack) =>
    set({ soundPack: pack }),
}));