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

      {/* Mobile hamburger nav */}
      <MobileNav />

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Addition.site</h1>
        <p className="text-gray-400">Your Modern Calculator</p>
      </div>

      {/* Three column layout */}
      <div className="hidden md:flex items-start justify-center gap-6">
        <SideCard title="Other Calculators" links={otherCalculators} />
        <div className="flex flex-col items-center">
          <Calculator />
          <div className="mt-12" style={{ width: '384px' }}>
            <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
          </div>
        </div>
        <SideCard title="Useful Tools" links={usefulTools} />
      </div>

      {/* Mobile: just the calculator, nav handles links */}
      <div className="flex flex-col items-center md:hidden">
        <Calculator />
        <div className="mt-12" style={{ width: '100%', maxWidth: '384px' }}>
          <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
        </div>
      </div>

    </main>
  );
}