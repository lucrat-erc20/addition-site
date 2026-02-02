// src/components/Calculator.tsx

'use client';

import { useState } from 'react';
import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';

export default function Calculator() {
  const [display, setDisplay] = useState('0');

  const handleButtonClick = (value: string) => {
    // Temporary - we'll wire this up properly in Step 13
    if (display === '0') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
        <Display value={display} />
        <ButtonGrid onButtonClick={handleButtonClick} />
      </div>
    </div>
  );
}