// app/store/sensoryStore.ts

/**
 * Zustand store for the Sensory Drive pedal
 * Controls all knob values, cable connections, and power state
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

  // Cable connections (indexed: 0=Signal/Volume, 1=Drive, 2=Return/Tone, 3=Trig/Reverb, 4=Mod/Pitch)
  connected: boolean[];

  // Actions
  togglePower: () => void;
  setKnob: (knob: 'volume' | 'pitch' | 'tone' | 'reverb' | 'drive', value: number) => void;
  toggleCable: (index: number) => void;
}

export const useSensoryStore = create<SensoryState>((set, get) => ({
  systemOn: true,
  volume: 75,
  pitch: 50,
  tone: 60,
  reverb: 20,
  drive: 30,
  connected: [true, true, true, true, true],

  togglePower: () => set(s => ({ systemOn: !s.systemOn })),

  setKnob: (knob, value) => set({ [knob]: Math.max(0, Math.min(100, value)) }),

  toggleCable: (index) => set(s => {
    const connected = [...s.connected];
    connected[index] = !connected[index];
    return { connected };
  }),
}));