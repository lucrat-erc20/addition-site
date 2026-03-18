// app/components/Calculator.tsx

'use client';

import { useCallback } from 'react';
import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';
import VolumeSlider from './ui/VolumeSlider';
import CarbonFibreBackground from './ui/CarbonFibreBackground';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useAudioStore } from '@/store/audioStore';
import { useCarbonStore } from '@/store/carbonStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useAudio } from '@/hooks/useAudio';

export default function Calculator() {
  const { 
    display, 
    currentOperator, 
    hasError,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    clearAll,
    backspace,
    toggleSign,
    percentage,
    square,
    squareRoot,
    reciprocal
  } = useCalculatorStore();

  const { volume, isMuted } = useAudioStore();
  const { play } = useAudio(isMuted ? 0 : volume);
  const { nudge } = useCarbonStore();

  const handleButtonClick = useCallback((value: string) => {
    if (!value) return;

    // Play random key sound
    play();

    // Nudge carbon fibre background
    nudge();
    
    if (/^[0-9]$/.test(value)) {
      inputDigit(value);
      return;
    }
    if (value === '.') {
      inputDecimal();
      return;
    }
    if (value === '+') {
      inputOperator('+');
      return;
    }
    if (value === '-') {
      inputOperator('-');
      return;
    }
    if (value === 'x') {
      inputOperator('*');
      return;
    }
    if (value === '÷') {
      inputOperator('/');
      return;
    }
    if (value === '=') {
      calculate();
      return;
    }
    if (value === 'C') {
      clear();
      return;
    }
    if (value === 'AC') {
      clearAll();
      return;
    }
    if (value === '⌫') {
      backspace();
      return;
    }
    if (value === '±') {
      toggleSign();
      return;
    }
    if (value === '%') {
      percentage();
      return;
    }
    if (value === 'x²') {
      square();
      return;
    }
    if (value === '√') {
      squareRoot();
      return;
    }
    if (value === '1/x') {
      reciprocal();
      return;
    }
  }, [play, nudge, inputDigit, inputDecimal, inputOperator, calculate, clear, clearAll, backspace, toggleSign, percentage, square, squareRoot, reciprocal]);

  useKeyboard(handleButtonClick);

  return (
    <div 
      className="inline-block relative rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
      style={{ padding: '20px' }}
    >
      {/* Carbon fibre background - animates on keypress */}
      <CarbonFibreBackground />
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Display */}
        <div style={{ width: '344px', height: '72px', marginBottom: '16px' }}>
          <Display 
            value={display} 
            operator={currentOperator} 
            hasError={hasError} 
          />
        </div>

        {/* Button Grid */}
        <ButtonGrid onButtonClick={handleButtonClick} />

        {/* Volume slider - below buttons */}
        <div className="mt-3 flex justify-end">
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}