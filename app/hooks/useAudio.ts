// app/hooks/useAudio.ts

/**
 * Audio hook for calculator key sounds
 * Uses Web Audio API for low-latency playback
 * Supports multiple sound files and volume control
 * 
 * Sounds:
 *  - key1.mp3: Number keys (0-9, .)
 *  - key2.mp3: Operator keys (+, -, x, ÷)
 *  - key3.mp3: Function keys (C, AC, ⌫, =, %, ±, x², √, 1/x)
 */

import { useEffect, useRef, useCallback } from 'react';

type SoundType = 'number' | 'operator' | 'function';

export function useAudio(volume: number) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const volumeRef = useRef(volume);

  // Keep volume ref in sync
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Initialize AudioContext and load buffers
  useEffect(() => {
    const init = async () => {
      // AudioContext must be created on user gesture - we'll create on first play
      // But we can pre-fetch the audio files
      const sounds = ['key1.mp3', 'key2.mp3', 'key3.mp3'];
      
      for (const sound of sounds) {
        try {
          const response = await fetch(`/sounds/${sound}`);
          const arrayBuffer = await response.arrayBuffer();
          // Store raw arrayBuffer - we'll decode when AudioContext is ready
          buffersRef.current.set(sound, arrayBuffer as any);
        } catch (e) {
          console.warn(`Failed to fetch ${sound}:`, e);
        }
      }
    };

    init();
  }, []);

  // Decode buffers once AudioContext exists
  const ensureContext = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    // Decode any raw arrayBuffers that haven't been decoded yet
    for (const [key, value] of buffersRef.current.entries()) {
      if (!(value instanceof AudioBuffer)) {
        try {
          const decoded = await audioCtxRef.current.decodeAudioData(value as any as ArrayBuffer);
          buffersRef.current.set(key, decoded);
        } catch (e) {
          console.warn(`Failed to decode ${key}:`, e);
        }
      }
    }
  }, []);

  // Play a sound
  const play = useCallback(async (type: SoundType) => {
    if (volumeRef.current === 0) return;

    await ensureContext();

    const soundMap: Record<SoundType, string> = {
      number: 'key1.mp3',
      operator: 'key2.mp3',
      function: 'key3.mp3',
    };

    const buffer = buffersRef.current.get(soundMap[type]);
    if (!buffer || !audioCtxRef.current || !(buffer instanceof AudioBuffer)) return;

    // Create source
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;

    // Create gain node for volume
    const gainNode = audioCtxRef.current.createGain();
    gainNode.gain.value = volumeRef.current;

    // Connect: source → gain → output
    source.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    // Play
    source.start();
  }, [ensureContext]);

  return { play };
}