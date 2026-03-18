// app/store/carbonStore.ts

/**
 * Zustand store for carbon fibre background animation
 * Values ease/lerp toward a target on each keypress
 * 
 * Ranges:
 *   A1 (top-left start):    22 → 32
 *   A2 (top-left end):      15 → 21
 *   B1 (top-right start):   26 → 36
 *   B2 (top-right end):      9 → 15
 * 
 * tileSize locked at 7
 */

import { create } from 'zustand';

interface CarbonValue {
  current: number;
  target: number;
  min: number;
  max: number;
}

interface CarbonState {
  tileSize: number;
  A1: CarbonValue;
  A2: CarbonValue;
  B1: CarbonValue;
  B2: CarbonValue;
  animationFrameId: number | null;

  // Trigger a new target on keypress
  nudge: () => void;
  // Called each animation frame to lerp current → target
  tick: () => void;
  // Start the animation loop
  startLoop: () => void;
  // Stop the animation loop
  stopLoop: () => void;
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  tileSize: 7,

  // A1: { current: 27, target: 27, min: 22, max: 32 },
  // A2: { current: 17, target: 17, min: 15, max: 21 },
  // B1: { current: 31, target: 31, min: 26, max: 36 },
  // B2: { current: 11, target: 11, min: 9,  max: 15 },

  A1: { current: 27, target: 27, min: 20, max: 50 },
  A2: { current: 17, target: 17, min: 5,  max: 25 },
  B1: { current: 31, target: 31, min: 15, max: 45 },
  B2: { current: 11, target: 11, min: 10, max: 30 },

  animationFrameId: null,

  // On keypress: pick new random targets within ranges
  nudge: () => {
    set((state) => ({
      A1: { ...state.A1, target: randomInRange(state.A1.min, state.A1.max) },
      A2: { ...state.A2, target: randomInRange(state.A2.min, state.A2.max) },
      B1: { ...state.B1, target: randomInRange(state.B1.min, state.B1.max) },
      B2: { ...state.B2, target: randomInRange(state.B2.min, state.B2.max) },
    }));
  },

  // Lerp current values toward targets (called each frame)
  tick: () => {
    const state = get();
    const factor = 0.04; // Easing speed - lower = slower/smoother

    const newA1 = lerp(state.A1.current, state.A1.target, factor);
    const newA2 = lerp(state.A2.current, state.A2.target, factor);
    const newB1 = lerp(state.B1.current, state.B1.target, factor);
    const newB2 = lerp(state.B2.current, state.B2.target, factor);

    // Only update if values have meaningfully changed
    const threshold = 0.01;
    if (
      Math.abs(newA1 - state.A1.current) > threshold ||
      Math.abs(newA2 - state.A2.current) > threshold ||
      Math.abs(newB1 - state.B1.current) > threshold ||
      Math.abs(newB2 - state.B2.current) > threshold
    ) {
      set((s) => ({
        A1: { ...s.A1, current: newA1 },
        A2: { ...s.A2, current: newA2 },
        B1: { ...s.B1, current: newB1 },
        B2: { ...s.B2, current: newB2 },
      }));
    }
  },

  // Start requestAnimationFrame loop
  startLoop: () => {
    const loop = () => {
      get().tick();
      const id = requestAnimationFrame(loop);
      set({ animationFrameId: id });
    };
    const id = requestAnimationFrame(loop);
    set({ animationFrameId: id });
  },

  // Stop loop
  stopLoop: () => {
    const { animationFrameId } = get();
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      set({ animationFrameId: null });
    }
  },
}));