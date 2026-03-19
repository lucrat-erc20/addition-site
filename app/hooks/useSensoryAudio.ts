// app/hooks/useSensoryAudio.ts

/**
 * Audio hook for Sensory Drive pedal
 * Plays real MP3 key sounds (key1/2/3.mp3) through a live
 * Web Audio processing chain driven by the pedal knobs:
 *
 *   BufferSource → GainNode (volume)
 *               → BiquadFilter (tone)
 *               → WaveShaperNode (drive/distortion)
 *               → DelayNode + feedback (reverb)
 *               → Destination
 *
 * Pitch is applied via source.playbackRate
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSensoryStore } from '@/store/sensoryStore';

const SOUNDS = ['key1.mp3', 'key2.mp3', 'key3.mp3'];

// Build a soft-clip distortion curve for the WaveShaper
function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const n = 256;
  const curve = new Float32Array(new ArrayBuffer(n * 4));
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export function useSensoryAudio() {
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const rawBuffersRef  = useRef<Map<string, ArrayBuffer>>(new Map());
  const buffersRef     = useRef<Map<string, AudioBuffer>>(new Map());

  // Live refs so play() always reads fresh store values
  const storeRef = useRef(useSensoryStore.getState());
  useEffect(() => {
    return useSensoryStore.subscribe(s => { storeRef.current = s; });
  }, []);

  // Pre-fetch MP3s on mount
  useEffect(() => {
    (async () => {
      for (const sound of SOUNDS) {
        try {
          const res = await fetch(`/sounds/${sound}`);
          rawBuffersRef.current.set(sound, await res.arrayBuffer());
        } catch (e) {
          console.warn(`Failed to fetch ${sound}:`, e);
        }
      }
    })();
  }, []);

  const ensureContext = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') await ctx.resume();

    for (const [key, raw] of rawBuffersRef.current.entries()) {
      if (!buffersRef.current.has(key)) {
        try {
          buffersRef.current.set(key, await ctx.decodeAudioData(raw.slice(0)));
        } catch (e) {
          console.warn(`Failed to decode ${key}:`, e);
        }
      }
    }
  }, []);

  const play = useCallback(async () => {
    const { systemOn, volume, pitch, tone, reverb, drive, connected } = storeRef.current;
    if (!systemOn) return;

    // Volume knob (cable 0 = Signal) controls whether sound plays at all
    const effectiveVolume = connected[0] ? volume / 100 : 0;
    if (effectiveVolume === 0) return;

    await ensureContext();
    const ctx = audioCtxRef.current!;

    const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const buffer = buffersRef.current.get(randomSound);
    if (!buffer) return;

    // ── Source ──
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Pitch (cable 4 = Mod). 0.5x to 2x playback rate mapped from 0–100
    const effectivePitch = connected[4] ? pitch : 50;
    source.playbackRate.value = 0.5 + (effectivePitch / 100) * 1.5;

    // ── Gain (volume) ──
    const gainNode = ctx.createGain();
    gainNode.gain.value = effectiveVolume;

    // ── Tone filter (cable 2 = Return). Lowpass 400Hz–8000Hz ──
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const effectiveTone = connected[2] ? tone : 60;
    filter.frequency.value = 400 + (effectiveTone / 100) * 7600;
    filter.Q.value = 1.2;

    // ── Drive / waveshaper (cable 1 = Drive) ──
    const shaper = ctx.createWaveShaper();
    const effectiveDrive = connected[1] ? drive : 0;
    shaper.curve = makeDistortionCurve(effectiveDrive * 4) as Float32Array<ArrayBuffer>;
    shaper.oversample = '4x';

    // ── Reverb via delay feedback loop (cable 3 = Trig) ──
    const effectiveReverb = connected[3] && reverb > 15 ? reverb / 100 : 0;
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.1;
    const fbGain = ctx.createGain();
    fbGain.gain.value = effectiveReverb * 0.5;

    // ── Chain: source → gain → filter → shaper → destination ──
    source.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(shaper);
    shaper.connect(ctx.destination);

    // Reverb parallel send
    if (effectiveReverb > 0.15) {
    const wetGain = ctx.createGain();
    wetGain.gain.value = effectiveReverb * 0.25;
    shaper.connect(delay);
    delay.connect(fbGain);
    fbGain.connect(delay);
    fbGain.connect(wetGain);
    wetGain.connect(ctx.destination);
    }

    source.start();
  }, [ensureContext]);

  // Connection pop + hum sound (called from pedal on cable click)
  const playConnectionPop = useCallback((isConnect: boolean) => {
    if (!storeRef.current.systemOn) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
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
  }, []);

  return { play, playConnectionPop };
}