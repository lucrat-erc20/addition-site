// app/components/Calculator.tsx

'use client';

import { useState } from 'react';
import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';

export default function Calculator() {
  const [display, setDisplay] = useState('0');

  const handleButtonClick = (value: string) => {
    // Temporary - we'll wire this up properly in Step 13
    if (!value) return; // Special button clicked
    
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <div className="inline-block p-[20px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700">
      {/* Display: 43x9 units = 344px x 72px */}
      <div style={{ width: '344px', height: '72px', marginBottom: '16px' }}>
        <Display value={display} />
      </div>
      
      {/* Button Grid */}
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
}