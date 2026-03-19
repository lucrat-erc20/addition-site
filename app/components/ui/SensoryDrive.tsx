// app/components/ui/SensoryDrive.tsx

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSensoryStore } from '@/store/sensoryStore';
import { useSensoryAudio } from '@/hooks/useSensoryAudio';

export const CABLES = [
  { color: '#ffee44', label: 'Signal', knob: 'volume'  as const, labelColor: '#aa8800' },
  { color: '#ff4444', label: 'Drive',  knob: 'drive'   as const, labelColor: '#aa3333' },
  { color: '#4488ff', label: 'Return', knob: 'tone'    as const, labelColor: '#3366cc' },
  { color: '#44ff88', label: 'Trig',   knob: 'reverb'  as const, labelColor: '#33aa66' },
  { color: '#ff8844', label: 'Mod',    knob: 'pitch'   as const, labelColor: '#cc6633' },
];

const PACKS = ['Mechanical 1', 'Mechanical 2', 'Typewriter', 'Soft Tactile', 'Clicky Blue'];

// ── Knob canvas renderer ───────────────────────────────────────────────────
function drawKnobCanvas(
  canvas: HTMLCanvasElement,
  value: number,
  active: boolean,
  isOnOff?: boolean,
  systemOn?: boolean
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const s = canvas.width;
  const cx = s / 2, cy = s / 2, r = s / 2 - 3;
  const startA = Math.PI * 0.75, endA = Math.PI * 2.25;
  const angle  = startA + (value / 100) * (endA - startA);
  const gold   = isOnOff ? !!systemOn : active;

  ctx.clearRect(0, 0, s, s);

  ctx.beginPath(); ctx.arc(cx, cy, r - 4, startA, endA);
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3; ctx.stroke();

  if (gold) {
    ctx.beginPath(); ctx.arc(cx, cy, r - 4, startA, angle);
    ctx.strokeStyle = '#c8a84b'; ctx.lineWidth = 3; ctx.stroke();
  }

  const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, 0, cx, cy, r - 5);
  if (gold) {
    grad.addColorStop(0, '#c8a84b'); grad.addColorStop(0.55, '#7a6020'); grad.addColorStop(1, '#050505');
  } else {
    grad.addColorStop(0, '#1e1e1e'); grad.addColorStop(0.55, '#111'); grad.addColorStop(1, '#050505');
  }
  ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();

  if (gold || isOnOff) {
    const ix = cx + (r - 9) * Math.cos(angle);
    const iy = cy + (r - 9) * Math.sin(angle);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ix, iy);
    ctx.strokeStyle = isOnOff && !systemOn ? '#333' : '#fffbe0';
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
  }

  ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
}

// ── Knob ──────────────────────────────────────────────────────────────────
interface KnobProps {
  id: string; label: string; value: number; active: boolean; size?: number;
  onChange: (v: number) => void;
}

function Knob({ id, label, value, active, size = 58, onChange }: KnobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef   = useRef<{ startY: number; startVal: number } | null>(null);

  useEffect(() => {
    if (canvasRef.current) drawKnobCanvas(canvasRef.current, value, active);
  }, [value, active]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!active) return;
    dragRef.current = { startY: e.clientY, startVal: value };
    e.preventDefault();
  }, [active, value]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = (dragRef.current.startY - e.clientY) * 0.85;
      onChange(Math.max(0, Math.min(100, dragRef.current.startVal + delta)));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [onChange]);

  return (
    <div className="flex flex-col items-center gap-1" style={{ opacity: active ? 1 : 0.2, transition: 'opacity 0.3s' }}>
      <span style={{ fontSize: '0.46rem', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase' }}>{label}</span>
      <canvas ref={canvasRef} id={id} width={size} height={size} onMouseDown={onMouseDown}
        style={{ cursor: active ? 'grab' : 'default', borderRadius: '50%', display: 'block' }} />
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.56rem', color: '#666' }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

// ── Power knob ─────────────────────────────────────────────────────────────
function PowerKnob({ systemOn, onToggle }: { systemOn: boolean; onToggle: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) drawKnobCanvas(canvasRef.current, systemOn ? 82 : 18, true, true, systemOn);
  }, [systemOn]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontSize: '0.46rem', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase' }}>Power</span>
      <canvas ref={canvasRef} width={58} height={58} onClick={onToggle}
        style={{ cursor: 'pointer', borderRadius: '50%', display: 'block' }} />
      <div className="flex gap-1.5 mt-0.5">
        {[
          { label: 'ON',  on: systemOn,  activeColor: '#7acc33', activeBorder: '#4a8a1a', activeBg: 'rgba(74,138,26,0.12)' },
          { label: 'OFF', on: !systemOn, activeColor: '#ff4444', activeBorder: '#882222', activeBg: 'rgba(136,34,34,0.12)' },
        ].map(t => (
          <span key={t.label} style={{
            fontSize: '0.4rem', letterSpacing: '0.12em', padding: '2px 5px', borderRadius: 3,
            border: `1px solid ${t.on ? t.activeBorder : '#2a2a2a'}`,
            color: t.on ? t.activeColor : '#2a2a2a',
            background: t.on ? t.activeBg : 'transparent',
            fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', transition: 'all 0.2s',
          }}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Port hole ──────────────────────────────────────────────────────────────
function PortHole({ plugged, color, label, labelColor, onClick }: {
  plugged: boolean; color: string; label: string; labelColor: string; onClick: () => void;
}) {
  const [pulse, setPulse] = useState(false);
  const handle = () => { setPulse(true); setTimeout(() => setPulse(false), 500); onClick(); };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div onClick={handle} style={{
        width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
        background: plugged ? 'radial-gradient(circle at 38% 38%, #2a2a2a, #111)' : 'radial-gradient(circle at 38% 38%, #1a1a1a, #050505)',
        border: `2px solid ${plugged ? color : '#2a2a2a'}`,
        boxShadow: plugged ? `0 0 8px rgba(0,0,0,0.8)${pulse ? ', 0 0 20px rgba(255,255,255,0.4)' : ''}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'border-color 0.15s',
      }}>
        <div style={{
          width: plugged ? 7 : 9, height: plugged ? 7 : 9, borderRadius: '50%',
          background: plugged ? color : '#050505',
          border: plugged ? 'none' : '1px solid #1a1a1a',
          boxShadow: plugged ? `0 0 4px ${color}` : 'none',
          transition: 'all 0.2s',
        }} />
        {plugged && (
          <div style={{
            position: 'absolute', width: 6, height: 6, borderRadius: '50%',
            background: 'conic-gradient(#444 0deg, #222 90deg, #555 180deg, #333 270deg)',
            border: '1px solid #444',
          }} />
        )}
      </div>
      <span style={{ fontSize: '0.38rem', letterSpacing: '0.08em', color: labelColor, textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ── LED strip ──────────────────────────────────────────────────────────────
function LEDStrip({ systemOn }: { systemOn: boolean }) {
  const [activeLed, setActiveLed] = useState<number | null>(null);
  const [isAmber,   setIsAmber]   = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trigger = useCallback(() => {
    if (!systemOn) return;
    if (intervalRef.current) return;
    setIsAmber(false);
    let idx = 0;
    intervalRef.current = setInterval(() => { setActiveLed(idx % 8); idx++; }, 75);
    setTimeout(() => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      setActiveLed(null); setIsAmber(true);
    }, 750);
  }, [systemOn]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__sensoryTriggerLED = trigger;
    return () => { delete (window as unknown as Record<string, unknown>).__sensoryTriggerLED; };
  }, [trigger]);

  useEffect(() => {
    if (!systemOn) { setActiveLed(null); setIsAmber(false); }
    else setIsAmber(true);
  }, [systemOn]);

  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 8 }, (_, i) => {
        const on = systemOn && activeLed === i;
        const am = systemOn && isAmber && i === 3;
        return (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: on ? '#4aff88' : am ? '#c8a84b' : '#111',
            border: `1px solid ${on ? '#4aff88' : am ? '#c8a84b' : '#1e1e1e'}`,
            boxShadow: on ? '0 0 7px #4aff88,0 0 14px rgba(74,255,136,0.3)' : am ? '0 0 7px #c8a84b' : 'none',
            transition: 'all 0.08s',
          }} />
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface SensoryDriveProps {
  pedalPortRefs: React.RefObject<HTMLDivElement | null>[];
  onCableChange: () => void;
}

export default function SensoryDrive({ pedalPortRefs, onCableChange }: SensoryDriveProps) {
  const {
    systemOn, volume, pitch, tone, reverb, drive, connected,
    togglePower, setKnob, toggleCable,
  } = useSensoryStore();

  const { playConnectionPop } = useSensoryAudio();
  const [packIdx, setPackIdx]       = useState(0);
  const [dropdownOpen, setDropdown] = useState(false);

  const handleCableToggle = (i: number) => {
    toggleCable(i);
    playConnectionPop(!connected[i]);
    setTimeout(onCableChange, 30);
  };

  const knobDefs = [
    { key: 'volume' as const, label: 'Volume', value: volume, cableIdx: 0 },
    { key: 'drive'  as const, label: 'Drive',  value: drive,  cableIdx: 1 },
    { key: 'tone'   as const, label: 'Tone',   value: tone,   cableIdx: 2 },
    { key: 'reverb' as const, label: 'Reverb', value: reverb, cableIdx: 3 },
    { key: 'pitch'  as const, label: 'Pitch',  value: pitch,  cableIdx: 4 },
  ];

  return (
    <div style={{
      width: 300, height: 500,
      background: 'linear-gradient(160deg, #1e1e1e, #111)',
      borderRadius: 18, border: '2px solid #2a2a2a',
      position: 'relative', flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.9)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Brushed texture */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
        background: 'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,0.007) 2px,rgba(255,255,255,0.007) 4px)',
      }} />

      {/* Screws */}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div key={pos} style={{
          position: 'absolute', width: 14, height: 14, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #4a4a4a, #1a1a1a)', border: '1px solid #333',
          top:    pos[0]==='t' ? 9 : undefined, bottom: pos[0]==='b' ? 9 : undefined,
          left:   pos[1]==='l' ? 9 : undefined, right:  pos[1]==='r' ? 9 : undefined,
        }} />
      ))}

      {/* Name */}
      <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: 200 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', color: '#3a3a3a' }}>ASMR Calculator</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.1em', color: '#c8a84b', lineHeight: 1, textShadow: '0 0 20px rgba(200,168,75,0.2)' }}>Sensory Drive</div>
        <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase', marginTop: 2 }}>Mechanical Sound Engine</div>
      </div>

      {/* Sound pack selector */}
      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', width: 210, zIndex: 20 }}>
        <div onClick={() => setDropdown(o => !o)} style={{
          background: '#080808', border: '1px solid #222', borderRadius: 5,
          padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sound Pack</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#c8a84b' }}>{PACKS[packIdx]}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span onClick={e => { e.stopPropagation(); setPackIdx(p => (p - 1 + PACKS.length) % PACKS.length); }}
              style={{ fontSize: '0.45rem', color: '#555', cursor: 'pointer', padding: '1px 3px' }}>▲</span>
            <span onClick={e => { e.stopPropagation(); setPackIdx(p => (p + 1) % PACKS.length); }}
              style={{ fontSize: '0.45rem', color: '#555', cursor: 'pointer', padding: '1px 3px' }}>▼</span>
          </div>
        </div>
        {dropdownOpen && (
          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: 5, overflow: 'hidden' }}>
            {PACKS.map((p, i) => (
              <div key={p} onClick={() => { setPackIdx(i); setDropdown(false); }} style={{
                padding: '7px 12px', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem',
                color: i === packIdx ? '#c8a84b' : '#444',
                background: i === packIdx ? '#0f0f0c' : 'transparent',
                cursor: 'pointer', borderBottom: '1px solid #111',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === packIdx ? '#c8a84b' : '#222' }} />
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Knobs 3×2 */}
      <div style={{
        position: 'absolute', top: 138, left: '50%', transform: 'translateX(-50%)',
        display: 'grid', gridTemplateColumns: 'repeat(3, 76px)', gap: '12px 6px',
      }}>
        {knobDefs.map(kd => (
          <Knob
            key={kd.key} id={`knob-${kd.key}`} label={kd.label} value={kd.value}
            active={connected[kd.cableIdx] && systemOn}
            onChange={v => setKnob(kd.key, v)}
          />
        ))}
        <PowerKnob systemOn={systemOn} onToggle={togglePower} />
      </div>

      {/* LEDs */}
      <div style={{ position: 'absolute', top: 356, left: '50%', transform: 'translateX(-50%)' }}>
        <LEDStrip systemOn={systemOn} />
      </div>

      {/* Stomp */}
      <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <div
          onClick={() => { const fn = (window as unknown as Record<string, () => void>).__sensoryTriggerLED; fn?.(); }}
          style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #c8a84b, #7a6020)',
            border: '2px solid #4a3a10', cursor: 'pointer',
            boxShadow: '0 4px 0 #1a0e00, 0 6px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.48rem', letterSpacing: '0.1em',
            color: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          TRIGGER
        </div>
        <span style={{ fontSize: '0.42rem', color: '#2a2a2a', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Test</span>
      </div>

      {/* Bottom jack ports */}
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        {CABLES.map((cab, i) => (
          <div key={i} ref={pedalPortRefs[i]}>
            <PortHole
              plugged={connected[i]} color={cab.color} label={cab.label} labelColor={cab.labelColor}
              onClick={() => handleCableToggle(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}