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
        <h1 className="text-5xl font-bold text-white mb-2">Addition.site</h1>
        <p className="text-gray-400">Your Modern Calculator</p>
      </div>

      {/* Desktop: 5-column layout with ghost cards for breathing room */}
      <div className="hidden md:flex items-start justify-center gap-6">

        {/* Ghost card left outer */}
        <div style={{ width: '160px', height: '420px' }} />

        {/* Left side card */}
        <SideCard title="Other Calculators" links={otherCalculators} height={410} />

        {/* Calculator + ad below */}
        <div className="flex flex-col items-center">
          <Calculator />
          <div className="mt-10" style={{ width: '384px' }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
        </div>

        {/* Right side card */}
        <SideCard title="Useful Tools" links={usefulTools} height={410} />

        {/* Ghost card right outer */}
        <div style={{ width: '160px', height: '420px' }} />

      </div>

      {/* Mobile: calculator only, nav handles links */}
      <div className="flex flex-col items-center md:hidden">
        <Calculator />
        <div className="mt-10" style={{ width: '100%', maxWidth: '384px' }}>
          <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
        </div>
      </div>

    </main>
  );
}