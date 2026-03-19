// app/components/ui/SensoryDrive.tsx

/**
 * Sensory Drive — ASMR Sound Pedal
 * Sits to the left of the calculator.
 * Cables connect from pedal bottom to calculator bottom-left.
 * Knobs control the live Web Audio processing chain.
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSensoryStore } from '@/store/sensoryStore';
import { useSensoryAudio } from '@/hooks/useSensoryAudio';

// ── Cable definitions ──────────────────────────────────────────────────────
const CABLES = [
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
  value: number,       // 0–100
  active: boolean,
  isOnOff?: boolean,
  systemOn?: boolean
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const s = canvas.width;
  const cx = s / 2, cy = s / 2, r = s / 2 - 3;
  const startA = Math.PI * 0.75, endA = Math.PI * 2.25;
  const angle = startA + (value / 100) * (endA - startA);
  const gold = isOnOff ? !!systemOn : active;

  ctx.clearRect(0, 0, s, s);

  // Track background
  ctx.beginPath(); ctx.arc(cx, cy, r - 4, startA, endA);
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3; ctx.stroke();

  // Track fill
  if (gold) {
    ctx.beginPath(); ctx.arc(cx, cy, r - 4, startA, angle);
    ctx.strokeStyle = '#c8a84b'; ctx.lineWidth = 3; ctx.stroke();
  }

  // Body gradient
  const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, 0, cx, cy, r - 5);
  if (gold) {
    grad.addColorStop(0, '#c8a84b');
    grad.addColorStop(0.55, '#7a6020');
    grad.addColorStop(1, '#050505');
  } else {
    grad.addColorStop(0, '#1e1e1e');
    grad.addColorStop(0.55, '#111');
    grad.addColorStop(1, '#050505');
  }
  ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.fillStyle = grad; ctx.fill();

  // Rim
  ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();

  // Indicator
  if (gold || isOnOff) {
    const ix = cx + (r - 9) * Math.cos(angle);
    const iy = cy + (r - 9) * Math.sin(angle);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ix, iy);
    ctx.strokeStyle = isOnOff && !systemOn ? '#333' : '#fffbe0';
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
  }

  // Centre dot
  ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
}

// ── Knob component ─────────────────────────────────────────────────────────
interface KnobProps {
  id: string;
  label: string;
  value: number;
  active: boolean;
  size?: number;
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
      <canvas
        ref={canvasRef}
        id={id}
        width={size}
        height={size}
        onMouseDown={onMouseDown}
        style={{ cursor: active ? 'grab' : 'default', borderRadius: '50%', display: 'block' }}
      />
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
    if (canvasRef.current)
      drawKnobCanvas(canvasRef.current, systemOn ? 82 : 18, true, true, systemOn);
  }, [systemOn]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontSize: '0.46rem', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase' }}>Power</span>
      <canvas
        ref={canvasRef}
        width={58} height={58}
        onClick={onToggle}
        style={{ cursor: 'pointer', borderRadius: '50%', display: 'block' }}
      />
      <div className="flex gap-1.5 mt-0.5">
        <span style={{
          fontSize: '0.4rem', letterSpacing: '0.12em', padding: '2px 5px',
          borderRadius: '3px', border: `1px solid ${systemOn ? '#4a8a1a' : '#2a2a2a'}`,
          color: systemOn ? '#7acc33' : '#2a2a2a',
          background: systemOn ? 'rgba(74,138,26,0.12)' : 'transparent',
          fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase',
          transition: 'all 0.2s'
        }}>ON</span>
        <span style={{
          fontSize: '0.4rem', letterSpacing: '0.12em', padding: '2px 5px',
          borderRadius: '3px', border: `1px solid ${!systemOn ? '#882222' : '#2a2a2a'}`,
          color: !systemOn ? '#ff4444' : '#2a2a2a',
          background: !systemOn ? 'rgba(136,34,34,0.12)' : 'transparent',
          fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase',
          transition: 'all 0.2s'
        }}>OFF</span>
      </div>
    </div>
  );
}

// ── Port hole ──────────────────────────────────────────────────────────────
function PortHole({ cableIdx, plugged, color, label, labelColor, onClick }: {
  cableIdx: number; plugged: boolean; color: string; label: string; labelColor: string; onClick: () => void;
}) {
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 500);
    onClick();
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        onClick={handleClick}
        style={{
          width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
          background: plugged
            ? 'radial-gradient(circle at 38% 38%, #2a2a2a, #111)'
            : 'radial-gradient(circle at 38% 38%, #1a1a1a, #050505)',
          border: `2px solid ${plugged ? color : '#2a2a2a'}`,
          boxShadow: plugged
            ? `0 0 8px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)${pulse ? `, 0 0 20px rgba(255,255,255,0.4)` : ''}`
            : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', transition: 'border-color 0.15s',
        }}
      >
        {/* Centre pip */}
        <div style={{
          width: plugged ? 7 : 9, height: plugged ? 7 : 9, borderRadius: '50%',
          background: plugged ? color : '#050505',
          border: plugged ? 'none' : '1px solid #1a1a1a',
          boxShadow: plugged ? `0 0 4px ${color}` : 'none',
          transition: 'all 0.2s',
        }} />
        {/* Jack shaft ring when plugged */}
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

// ── Cable SVG ──────────────────────────────────────────────────────────────
interface CableSVGProps {
  pedalPortRefs: React.RefObject<HTMLDivElement | null>[];
  calcPortRefs:  React.RefObject<HTMLDivElement | null>[];
  connected: boolean[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function CableSVG({ pedalPortRefs, calcPortRefs, connected, containerRef }: CableSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const redraw = useCallback(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;
    const cr = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${cr.width} ${cr.height}`);
    // Clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    CABLES.forEach((cab, i) => {
      if (!connected[i]) return;
      const pRef = pedalPortRefs[i]?.current;
      const cRef = calcPortRefs[i]?.current;
      if (!pRef || !cRef) return;
      const pr = pRef.getBoundingClientRect();
      const crf = cRef.getBoundingClientRect();
      const x1 = pr.left + pr.width  / 2 - cr.left;
      const y1 = pr.top  + pr.height / 2 - cr.top;
      const x2 = crf.left + crf.width  / 2 - cr.left;
      const y2 = crf.top  + crf.height / 2 - cr.top;
      const sag = 70 + i * 14;
      const cpY = Math.max(y1, y2) + sag;
      const d = `M${x1},${y1} C${x1},${cpY} ${x2},${cpY} ${x2},${y2}`;

      const ns = 'http://www.w3.org/2000/svg';

      // Glow
      const glow = document.createElementNS(ns, 'path');
      glow.setAttribute('d', d); glow.setAttribute('stroke', cab.color);
      glow.setAttribute('stroke-width', '12'); glow.setAttribute('fill', 'none');
      glow.setAttribute('opacity', '0.1'); svg.appendChild(glow);

      // Main cable
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d); path.setAttribute('stroke', cab.color);
      path.setAttribute('stroke-width', '8'); path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round'); path.setAttribute('opacity', '0.45');
      svg.appendChild(path);

      // Highlight
      const hi = document.createElementNS(ns, 'path');
      hi.setAttribute('d', d); hi.setAttribute('stroke', 'rgba(255,255,255,0.14)');
      hi.setAttribute('stroke-width', '2'); hi.setAttribute('fill', 'none');
      hi.setAttribute('opacity', '0.5'); svg.appendChild(hi);
    });
  }, [connected, pedalPortRefs, calcPortRefs, containerRef]);

  useEffect(() => {
    const timer = setTimeout(redraw, 80);
    return () => clearTimeout(timer);
  }, [connected, redraw]);

  useEffect(() => {
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [redraw]);

  return (
    <svg
      ref={svgRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
    />
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
    intervalRef.current = setInterval(() => {
      setActiveLed(idx % 8);
      idx++;
    }, 75);
    setTimeout(() => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      setActiveLed(null);
      setIsAmber(true);
    }, 750);
  }, [systemOn]);

  // Expose trigger globally so Calculator can call it
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
        const isActive = systemOn && activeLed === i;
        const isA      = systemOn && isAmber && i === 3;
        return (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isActive ? '#4aff88' : isA ? '#c8a84b' : '#111',
            border: `1px solid ${isActive ? '#4aff88' : isA ? '#c8a84b' : '#1e1e1e'}`,
            boxShadow: isActive ? '0 0 7px #4aff88, 0 0 14px rgba(74,255,136,0.3)' : isA ? '0 0 7px #c8a84b' : 'none',
            transition: 'all 0.08s',
          }} />
        );
      })}
    </div>
  );
}

// ── Main SensoryDrive component ────────────────────────────────────────────
interface SensoryDriveProps {
  calcPortRefs: React.RefObject<HTMLDivElement | null>[];
}


export default function SensoryDrive({ calcPortRefs }: SensoryDriveProps) {
  const {
    systemOn, volume, pitch, tone, reverb, drive, connected,
    togglePower, setKnob, toggleCable,
  } = useSensoryStore();

  const { playConnectionPop } = useSensoryAudio();

  const containerRef = useRef<HTMLDivElement>(null);
  const pedalPortRefs = useRef(Array.from({ length: 5 }, () => useRef<HTMLDivElement>(null)));

  const [packIdx, setPackIdx] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCableToggle = (i: number) => {
    toggleCable(i);
    playConnectionPop(!connected[i]);
  };

  const cyclePack = (dir: number) => {
    setPackIdx(p => (p + dir + PACKS.length) % PACKS.length);
  };

  const knobProps = [
    { key: 'volume' as const, label: 'Volume', value: volume, active: connected[0] && systemOn },
    { key: 'drive'  as const, label: 'Drive',  value: drive,  active: connected[1] && systemOn },
    { key: 'tone'   as const, label: 'Tone',   value: tone,   active: connected[2] && systemOn },
    { key: 'reverb' as const, label: 'Reverb', value: reverb, active: connected[3] && systemOn },
    { key: 'pitch'  as const, label: 'Pitch',  value: pitch,  active: connected[4] && systemOn },
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Cable SVG layer */}
      <CableSVG
        pedalPortRefs={pedalPortRefs.current}
        calcPortRefs={calcPortRefs}
        connected={connected}
        containerRef={containerRef}
      />

      {/* Pedal body */}
      <div style={{
        width: 300, height: 500,
        background: 'linear-gradient(160deg, #1e1e1e, #111)',
        borderRadius: 18, border: '2px solid #2a2a2a',
        position: 'relative',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.9)',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Brushed texture */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
          background: 'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,0.007) 2px,rgba(255,255,255,0.007) 4px)',
        }} />

        {/* Corner screws */}
        {['tl','tr','bl','br'].map(pos => (
          <div key={pos} style={{
            position: 'absolute', width: 14, height: 14, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #4a4a4a, #1a1a1a)',
            border: '1px solid #333',
            top:    pos.startsWith('t') ? 9 : undefined,
            bottom: pos.startsWith('b') ? 9 : undefined,
            left:   pos.endsWith('l')   ? 9 : undefined,
            right:  pos.endsWith('r')   ? 9 : undefined,
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
          <div
            onClick={() => setDropdownOpen(o => !o)}
            style={{ background: '#080808', border: '1px solid #222', borderRadius: 5, padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div>
              <div style={{ fontSize: '0.55rem', color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sound Pack</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#c8a84b' }}>{PACKS[packIdx]}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span onClick={e => { e.stopPropagation(); cyclePack(-1); }} style={{ fontSize: '0.45rem', color: '#555', cursor: 'pointer', padding: '1px 3px' }}>▲</span>
              <span onClick={e => { e.stopPropagation(); cyclePack(1);  }} style={{ fontSize: '0.45rem', color: '#555', cursor: 'pointer', padding: '1px 3px' }}>▼</span>
            </div>
          </div>

          {dropdownOpen && (
            <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: 5, overflow: 'hidden' }}>
              {PACKS.map((p, i) => (
                <div
                  key={p}
                  onClick={() => { setPackIdx(i); setDropdownOpen(false); }}
                  style={{
                    padding: '7px 12px', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem',
                    color: i === packIdx ? '#c8a84b' : '#444',
                    background: i === packIdx ? '#0f0f0c' : 'transparent',
                    cursor: 'pointer', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === packIdx ? '#c8a84b' : '#222', flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knobs 3×2 */}
        <div style={{
          position: 'absolute', top: 138, left: '50%', transform: 'translateX(-50%)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 76px)', gridTemplateRows: 'repeat(2, auto)', gap: '12px 6px',
        }}>
          {knobProps.map((kp, i) => (
            <Knob
              key={kp.key}
              id={`knob-${kp.key}`}
              label={kp.label}
              value={kp.value}
              active={kp.active}
              onChange={v => setKnob(kp.key, v)}
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

        {/* Bottom jack row */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {CABLES.map((cab, i) => (
            <div key={i} ref={pedalPortRefs.current[i]}>
              <PortHole
                cableIdx={i}
                plugged={connected[i]}
                color={cab.color}
                label={cab.label}
                labelColor={cab.labelColor}
                onClick={() => handleCableToggle(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export cable count for calculator to know how many ports to render
export { CABLES };