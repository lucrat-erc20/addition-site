// app/page.tsx

'use client';

import { useRef, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import SensoryDrive from './components/ui/SensoryDrive';
import SideCard from './components/ui/SideCard';
import MobileNav from './components/ui/MobileNav';
import { useSensoryStore } from '@/store/sensoryStore';

const CABLE_COLORS = ['#ffee44', '#ff4444', '#4488ff', '#44ff88', '#ff8844'];

const usefulTools = [
  { label: 'Random Number Generator', href: '#' },
  { label: 'Password Generator',      href: '#' },
  { label: 'Unit Converter',          href: '#' },
  { label: 'Tip Calculator',          href: '#' },
];

export default function Home() {
  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const pedalPortRefs = [r0, r1, r2, r3, r4];

  const c0 = useRef<HTMLDivElement>(null);
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);
  const c4 = useRef<HTMLDivElement>(null);
  const calcPortRefs = [c0, c1, c2, c3, c4];

  const svgRef      = useRef<SVGSVGElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const { connected } = useSensoryStore();

  const drawCables = useCallback(() => {
    const svg     = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    // Size SVG to match full scrollable content
    const W = wrapper.scrollWidth;
    const H = wrapper.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width',  String(W));
    svg.setAttribute('height', String(H));
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const wRect = wrapper.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const ns = 'http://www.w3.org/2000/svg';
    const R = 10; // corner radius for quarter-circle turns

    for (let i = 0; i < 5; i++) {
      if (!connected[i]) continue;
      const pEl = pedalPortRefs[i].current;
      const cEl = calcPortRefs[i].current;
      if (!pEl || !cEl) continue;

      const pr  = pEl.getBoundingClientRect();
      const crf = cEl.getBoundingClientRect();

      // Port centres relative to wrapper
      const px = pr.left  + pr.width  / 2 - wRect.left;
      const py = pr.top   + pr.height / 2 - wRect.top;
      const cx = crf.left + crf.width  / 2 - wRect.left;
      const cy = crf.top  + crf.height / 2 - wRect.top;

      let d: string;

      if (!isMobile) {
        // ── DESKTOP ──
        // Pedal is LEFT of calc.
        // Route: down from pedal → across right → up into calc
        // Each cable drops to a unique depth below both ports
        const dropY = Math.max(py, cy) + 30 + i * 16;

        d = [
          `M ${px} ${py}`,
          // drop straight down to corner
          `L ${px} ${dropY - R}`,
          `Q ${px} ${dropY} ${px + R} ${dropY}`,
          // run right
          `L ${cx - R} ${dropY}`,
          `Q ${cx} ${dropY} ${cx} ${dropY - R}`,
          // rise straight up into calc port
          `L ${cx} ${cy}`,
        ].join(' ');

      } else {
        // ── MOBILE ──
        // Calc is ABOVE pedal.
        // Route: left from calc port → down left side → right into pedal port
        // Each cable steps further left
        const leftX = Math.min(px, cx) - 30 - i * 16;

        d = [
          `M ${cx} ${cy}`,
          // run left from calc port
          `L ${leftX + R} ${cy}`,
          `Q ${leftX} ${cy} ${leftX} ${cy + R}`,
          // drop straight down
          `L ${leftX} ${py - R}`,
          `Q ${leftX} ${py} ${leftX + R} ${py}`,
          // run right into pedal port
          `L ${px} ${py}`,
        ].join(' ');
      }

      const col = CABLE_COLORS[i];

      // Glow
      const glow = document.createElementNS(ns, 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('stroke', col);
      glow.setAttribute('stroke-width', '14');
      glow.setAttribute('fill', 'none');
      glow.setAttribute('stroke-linecap', 'round');
      glow.setAttribute('stroke-linejoin', 'round');
      glow.setAttribute('opacity', '0.1');
      svg.appendChild(glow);

      // Main cable
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', col);
      path.setAttribute('stroke-width', '6');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', '0.55');
      svg.appendChild(path);

      // Highlight stripe
      const hi = document.createElementNS(ns, 'path');
      hi.setAttribute('d', d);
      hi.setAttribute('stroke', 'rgba(255,255,255,0.18)');
      hi.setAttribute('stroke-width', '1.5');
      hi.setAttribute('fill', 'none');
      hi.setAttribute('stroke-linecap', 'round');
      hi.setAttribute('opacity', '0.5');
      svg.appendChild(hi);
    }
  }, [connected, pedalPortRefs, calcPortRefs]);

  // Redraw on connection change
  useEffect(() => {
    const t = setTimeout(drawCables, 120);
    return () => clearTimeout(t);
  }, [connected, drawCables]);

  // Redraw on resize
  useEffect(() => {
    window.addEventListener('resize', drawCables);
    return () => window.removeEventListener('resize', drawCables);
  }, [drawCables]);

  // Initial draw after layout settles
  useEffect(() => {
    const t = setTimeout(drawCables, 300);
    return () => clearTimeout(t);
  }, [drawCables]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-12 p-4">
      <MobileNav />

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">ASMR Calculator</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          The most satisfying way to solve anything
        </p>
      </div>

      {/* Wrapper — SVG is absolutely positioned inside this */}
      <div ref={wrapperRef} style={{ position: 'relative' }}>

        {/* SVG cable layer — sits on top, no pointer events */}
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 20,
            overflow: 'visible',
          }}
        />

        {/* ── Desktop ── */}
        <div className="hidden md:flex items-start justify-center gap-6">
          <SensoryDrive pedalPortRefs={pedalPortRefs} />
          <div style={{ width: 40, flexShrink: 0 }} />
          <div className="flex flex-col items-start">
            <Calculator calcPortRefs={calcPortRefs} />
            <div style={{ height: 40 }} />
            <div style={{ width: 384 }}>
              <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
            </div>
          </div>
          <div style={{ width: 40, flexShrink: 0 }} />
          <SideCard title="Useful Tools" links={usefulTools} height={410} />
        </div>

        {/* ── Mobile ── */}
        <div className="flex flex-col items-center md:hidden gap-6">
          <Calculator calcPortRefs={calcPortRefs} />
          <div style={{ width: '100%', maxWidth: 384 }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
          <SensoryDrive pedalPortRefs={pedalPortRefs} />
        </div>

      </div>
    </main>
  );
}