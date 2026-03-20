// app/hooks/useSensoryAudio.ts

/**
 * Audio hook for the Sensory Drive pedal.
 * Plays clean MP3 key sounds from the active sound pack.
 * Reloads buffers automatically when the sound pack changes.
 * Each knob plays a distinct tone when turned.
 *
 * Sound packs live at: /public/sounds/{pack-slug}/key1.mp3 etc.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSensoryStore } from '@/store/sensoryStore';

const SOUNDS = ['key1.mp3', 'key2.mp3', 'key3.mp3'];

// One distinct frequency per knob slot (Volume, Drive, Tone, Reverb, Pitch, Power)
const KNOB_FREQS = [220, 277, 330, 392, 494, 523];

export function useSensoryAudio() {
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const rawBuffersRef = useRef<Map<string, ArrayBuffer>>(new Map());
  const buffersRef    = useRef<Map<string, AudioBuffer>>(new Map());
  const loadedPackRef = useRef<string>('');

  // Live ref so callbacks always read fresh store values
  const storeRef = useRef(useSensoryStore.getState());
  useEffect(() =>
    useSensoryStore.subscribe(s => { storeRef.current = s; })
  , []);

  // Create or resume AudioContext
  const ensureContext = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
  }, []);

  // Synchronous context getter for non-async functions
  const getContext = useCallback((): AudioContext | null => {
    return audioCtxRef.current;
  }, []);

  // Load all three sounds for a given pack slug
  const loadPack = useCallback(async (pack: string) => {
    if (loadedPackRef.current === pack) return;
    loadedPackRef.current = pack;
    rawBuffersRef.current.clear();
    buffersRef.current.clear();

    for (const sound of SOUNDS) {
      try {
        const res = await fetch(`/sounds/${pack}/${sound}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        rawBuffersRef.current.set(sound, await res.arrayBuffer());
      } catch (e) {
        console.warn(`Sensory Drive: failed to fetch ${pack}/${sound}:`, e);
      }
    }
  }, []);

  // Decode any raw buffers not yet decoded
  const decodeBuffers = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    for (const [key, raw] of rawBuffersRef.current.entries()) {
      if (!buffersRef.current.has(key)) {
        try {
          buffersRef.current.set(key, await ctx.decodeAudioData(raw.slice(0)));
        } catch (e) {
          console.warn(`Sensory Drive: failed to decode ${key}:`, e);
        }
      }
    }
  }, []);

  // Pre-load the default pack on mount
  useEffect(() => {
    loadPack(storeRef.current.soundPack);
  }, [loadPack]);

  // Play a random MP3 from the current pack — clean, no processing chain
  const play = useCallback(async () => {
    const { systemOn, volume, connected, soundPack } = storeRef.current;
    if (!systemOn) return;

    // Signal cable (index 0) gates volume
    const effectiveVolume = connected[0] ? volume / 100 : 0;
    if (effectiveVolume === 0) return;

    await ensureContext();

    if (loadedPackRef.current !== soundPack) {
      await loadPack(soundPack);
    }

    await decodeBuffers();

    const ctx = audioCtxRef.current!;
    const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const buffer = buffersRef.current.get(randomSound);
    if (!buffer) return;

    const source   = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer       = buffer;
    gainNode.gain.value = effectiveVolume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  }, [ensureContext, loadPack, decodeBuffers]);

  // Play a short sine tone when a knob is turned
  // knobIndex 0-5 maps to KNOB_FREQS for a distinct pitch per knob
  const playKnobTone = useCallback((knobIndex: number) => {
    if (!storeRef.current.systemOn) return;
    const ctx = getContext();
    if (!ctx) return;
    try {
      const t    = ctx.currentTime;
      const freq = KNOB_FREQS[knobIndex] ?? 330;

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type          = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {}
  }, [getContext]);

  // Connection pop + hum on cable plug/unplug
  const playConnectionPop = useCallback((isConnect: boolean) => {
    if (!storeRef.current.systemOn) return;
    const ctx = getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isConnect ? 90 : 55, t);
      osc.frequency.exponentialRampToValueAtTime(isConnect ? 38 : 22, t + 0.1);
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.start(t); osc.stop(t + 0.14);

      if (isConnect) {
        const hum = ctx.createOscillator();
        const hg  = ctx.createGain();
        const hf  = ctx.createBiquadFilter();
        hum.connect(hf); hf.connect(hg); hg.connect(ctx.destination);
        hum.type = 'sawtooth'; hum.frequency.value = 60;
        hf.type = 'lowpass'; hf.frequency.value = 380;
        hg.gain.setValueAtTime(0, t);
        hg.gain.linearRampToValueAtTime(0.04, t + 0.06);
        hg.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
        hum.start(t); hum.stop(t + 1.1);
      }
    } catch (e) {}
  }, [getContext]);

  return { play, playConnectionPop, playKnobTone };
}