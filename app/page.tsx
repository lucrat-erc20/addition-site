// app/page.tsx

'use client';

import { useRef } from 'react';
import Calculator from './components/Calculator';
import SensoryDrive from './components/ui/SensoryDrive';
import SideCard from './components/ui/SideCard';
import MobileNav from './components/ui/MobileNav';

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
  // 5 refs — one per cable port on the calculator bottom
  const calcPortRefs = useRef(
    Array.from({ length: 5 }, () => useRef<HTMLDivElement>(null))
  ).current;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-12 p-4">
      <MobileNav />

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">ASMR Calculator</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">The most satisfying way to solve anything</p>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex items-start justify-center gap-6">

        {/* LEFT: Sensory Drive pedal in the ghost slot */}
        <SensoryDrive calcPortRefs={calcPortRefs} />

        {/* Ghost spacer left */}
        <div style={{ width: 40, flexShrink: 0 }} />

        {/* Centre: Calculator + ad */}
        <div className="flex flex-col items-start">
          <Calculator calcPortRefs={calcPortRefs} />

          {/* Ghost below calculator */}
          <div style={{ width: '100%', height: 40 }} />

          {/* Adsterra ad */}
          <div style={{ width: 384 }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
        </div>

        {/* Ghost spacer right */}
        <div style={{ width: 40, flexShrink: 0 }} />

        {/* RIGHT: Useful tools card */}
        <SideCard title="Useful Tools" links={usefulTools} height={410} />

      </div>

      {/* ── Mobile layout ── */}
      <div className="flex flex-col items-center md:hidden">
        {/* No pedal on mobile — show plain calculator */}
        <Calculator calcPortRefs={calcPortRefs} />
        <div style={{ width: '100%', maxWidth: 384, height: 32 }} />
        <div style={{ width: '100%', maxWidth: 384 }}>
          <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
        </div>
      </div>

    </main>
  );
}