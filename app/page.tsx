// app/page.tsx

'use client';

import { useRef } from 'react';
import Calculator from './components/Calculator';
import SensoryDrive from './components/ui/SensoryDrive';
import SideCard from './components/ui/SideCard';
import MobileNav from './components/ui/MobileNav';

const usefulTools = [
  { label: '📝 Blog',                 href: '/blog' },
  { label: '⚡ Full Amp Calculator',  href: '/full-amp-interest' },
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-12 p-4">
      <MobileNav />

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">ASMR Calculator</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          The most satisfying way to solve anything
        </p>
      </div>

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

    </main>
  );
}