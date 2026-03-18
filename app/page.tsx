// app/page.tsx

import Calculator from './components/Calculator';
import SideCard from './components/ui/SideCard';
import MobileNav from './components/ui/MobileNav';

const otherCalculators = [
  { label: 'Mortgage Calculator', href: '#' },
  { label: 'Loan Calculator', href: '#' },
  { label: 'Compound Interest', href: '#' },
  { label: 'Tax Calculator', href: '#' },
];

const usefulTools = [
  { label: 'Random Number Generator', href: '#' },
  { label: 'Password Generator', href: '#' },
  { label: 'Unit Converter', href: '#' },
  { label: 'Tip Calculator', href: '#' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-12 p-4">

      <MobileNav />

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">ASMR Calculator</h1>
        <p className="text-gray-400">The most satisfying way to solve anything.</p>
      </div>

      {/* Desktop: 5-column layout with ghost cards for breathing room */}
      <div className="hidden md:flex items-start justify-center gap-6">

        {/* Left side card */}
        <SideCard title="Other Calculators" links={otherCalculators} height={410} />

        {/* Ghost card left inner */}
        <div style={{ width: '160px', height: '410px', background: 'rgba(0,0,0,0.0)' }} />

        {/* Calculator + ad below */}
        <div className="flex flex-col items-center">
          <Calculator />
          {/* Ghost below calculator */}
          <div style={{ width: '384px', height: '160px', background: 'rgba(0,0,0,0.0)' }} />
          {/* Ad */}
          <div style={{ width: '384px' }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
        </div>

        {/* Ghost card right inner */}
        <div style={{ width: '160px', height: '410px', background: 'rgba(0,0,0,0.0)' }} />

        {/* Right side card */}
        <SideCard title="Useful Tools" links={usefulTools} height={410} />



      </div>

      {/* Mobile layout */}
      <div className="flex flex-col items-center md:hidden">
        <Calculator />
        {/* Ghost below calculator */}
        <div style={{ width: '100%', maxWidth: '384px', height: '160px', background: 'rgba(0,0,0,0.3)' }} />
        {/* Ad always visible */}
        <div style={{ width: '100%', maxWidth: '384px' }}>
          <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
        </div>
      </div>

    </main>
  );
}