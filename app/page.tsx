// app/page.tsx

'use client';

import { useRef, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import SensoryDrive from './components/ui/SensoryDrive';
import SideCard from './components/ui/SideCard';
import MobileNav from './components/ui/MobileNav';
import { useSensoryStore } from '@/store/sensoryStore';

const CABLE_COLORS = ['#ffee44', '#ff4444', '#4488ff', '#44ff88', '#ff8844'];

const otherCalculators = [
  { label: 'Mortgage Calculator',  href: '#' },
  { label: 'Loan Calculator',      href: '#' },
  { label: 'Compound Interest',    href: '#' },
  { label: 'Tax Calculator',       href: '#' },
];

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

  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { connected } = useSensoryStore();

  const drawCables = useCallback(() => {
    const svg       = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const cr = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${cr.width} ${cr.height}`);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const isMobile = window.innerWidth < 768;
    const ns = 'http://www.w3.org/2000/svg';

    for (let i = 0; i < 5; i++) {
      if (!connected[i]) continue;
      const pEl = pedalPortRefs[i].current;
      const cEl = calcPortRefs[i].current;
      if (!pEl || !cEl) continue;

      const pr  = pEl.getBoundingClientRect();
      const crf = cEl.getBoundingClientRect();

      // Coords relative to the container div — key fix
      const x1 = pr.left  + pr.width  / 2 - cr.left;
      const y1 = pr.top   + pr.height / 2 - cr.top;
      const x2 = crf.left + crf.width  / 2 - cr.left;
      const y2 = crf.top  + crf.height / 2 - cr.top;

      let d: string;
      if (isMobile) {
        // Pedal is below calc — route cables around the LEFT outside edge
        // Step out further left for each cable so they don't overlap the pedal
        const margin = 30 + i * 16;
        const leftX  = Math.min(x1, x2) - margin;
        d = `M${x1},${y1} C${leftX},${y1} ${leftX},${y2} ${x2},${y2}`;
      } else {
        // Pedal is left of calc — cables droop down between them
        const sag = 60 + i * 14;
        const cpY = Math.max(y1, y2) + sag;
        d = `M${x1},${y1} C${x1},${cpY} ${x2},${cpY} ${x2},${y2}`;
      }

      const col = CABLE_COLORS[i];

      const glow = document.createElementNS(ns, 'path');
      glow.setAttribute('d', d); glow.setAttribute('stroke', col);
      glow.setAttribute('stroke-width', '12'); glow.setAttribute('fill', 'none');
      glow.setAttribute('opacity', '0.08'); svg.appendChild(glow);

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d); path.setAttribute('stroke', col);
      path.setAttribute('stroke-width', '8'); path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round'); path.setAttribute('opacity', '0.45');
      svg.appendChild(path);

      const hi = document.createElementNS(ns, 'path');
      hi.setAttribute('d', d); hi.setAttribute('stroke', 'rgba(255,255,255,0.14)');
      hi.setAttribute('stroke-width', '2'); hi.setAttribute('fill', 'none');
      hi.setAttribute('opacity', '0.5'); svg.appendChild(hi);
    }
  }, [connected, pedalPortRefs, calcPortRefs]);

  useEffect(() => {
    const t = setTimeout(drawCables, 150);
    return () => clearTimeout(t);
  }, [connected, drawCables]);

  useEffect(() => {
    window.addEventListener('resize', drawCables);
    return () => window.removeEventListener('resize', drawCables);
  }, [drawCables]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-12 p-4">
      <MobileNav />

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">ASMR Calculator</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">The most satisfying way to solve anything</p>
      </div>

      {/* Container — SVG cable layer is relative to this div */}
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <svg
          ref={svgRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 20,
            overflow: 'visible',
          }}
        />

        {/* Desktop */}
        <div className="hidden md:flex items-start justify-center gap-6">
          <SensoryDrive pedalPortRefs={pedalPortRefs} onCableChange={drawCables} />
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

        {/* Mobile */}
        <div className="flex flex-col items-center md:hidden gap-0">
          <Calculator calcPortRefs={calcPortRefs} />
          <div style={{ height: 24 }} />
          <div style={{ width: '100%', maxWidth: 384 }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
          <div style={{ height: 32 }} />
          <SensoryDrive pedalPortRefs={pedalPortRefs} onCableChange={drawCables} />
        </div>

      </div>
    </main>
  );
}