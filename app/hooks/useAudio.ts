// app/hooks/useAudio.ts

/**
 * Audio hook for calculator key sounds
 * Uses Web Audio API for low-latency playback
 * Plays a random sound from key1.mp3, key2.mp3, key3.mp3 on every keypress
 */

import { useEffect, useRef, useCallback } from 'react';

const SOUNDS = ['key1.mp3', 'key2.mp3', 'key3.mp3'];

export function useAudio(volume: number) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const rawBuffersRef = useRef<Map<string, ArrayBuffer>>(new Map());
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Pre-fetch audio files on mount
  useEffect(() => {
    const prefetch = async () => {
      for (const sound of SOUNDS) {
        try {
          const response = await fetch(`/sounds/${sound}`);
          const arrayBuffer = await response.arrayBuffer();
          rawBuffersRef.current.set(sound, arrayBuffer);
        } catch (e) {
          console.warn(`Failed to fetch ${sound}:`, e);
        }
      }
    };
    prefetch();
  }, []);

  // Create/resume AudioContext and decode any pending buffers
  const ensureContext = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    // Decode raw buffers that haven't been decoded yet
    for (const [key, raw] of rawBuffersRef.current.entries()) {
      if (!buffersRef.current.has(key)) {
        try {
          const decoded = await audioCtxRef.current.decodeAudioData(raw.slice(0));
          buffersRef.current.set(key, decoded);
        } catch (e) {
          console.warn(`Failed to decode ${key}:`, e);
        }
      }
    }
  }, []);

  // Play a random sound
  const play = useCallback(async () => {
    if (volumeRef.current === 0) return;

    await ensureContext();

    // Pick random sound
    const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const buffer = buffersRef.current.get(randomSound);

    if (!buffer || !audioCtxRef.current) return;

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioCtxRef.current.createGain();
    gainNode.gain.value = volumeRef.current;

    source.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    source.start();
  }, [ensureContext]);

  return { play };
}