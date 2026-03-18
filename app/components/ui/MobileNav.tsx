// app/components/ui/MobileNav.tsx

'use client';

import { useState } from 'react';

const sections = [
  {
    title: 'Other Calculators',
    links: [
      { label: 'Mortgage Calculator', href: '#' },
      { label: 'Loan Calculator', href: '#' },
      { label: 'Compound Interest', href: '#' },
      { label: 'Tax Calculator', href: '#' },
    ],
  },
  {
    title: 'Useful Tools',
    links: [
      { label: 'Random Number Generator', href: '#' },
      { label: 'Password Generator', href: '#' },
      { label: 'Unit Converter', href: '#' },
      { label: 'Tip Calculator', href: '#' },
    ],
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 w-56">
          {sections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-300 hover:text-white py-1.5 px-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}