// app/components/Calculator.tsx

'use client';

import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';
import CarbonFibreBackground from './ui/CarbonFibreBackground';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useKeyboard } from '@/hooks/useKeyboard';

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

  const handleButtonClick = (value: string) => {
    if (!value) return;
    
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
  };

  useKeyboard(handleButtonClick);

  return (
    <div 
      className="inline-block relative rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
      style={{ padding: '20px' }}
    >
      {/* Carbon fibre background - locked settings */}
      <CarbonFibreBackground />
      
      {/* Content layer */}
      <div className="relative z-10">
        <div style={{ width: '344px', height: '72px', marginBottom: '16px' }}>
          <Display 
            value={display} 
            operator={currentOperator} 
            hasError={hasError} 
          />
        </div>
        <ButtonGrid onButtonClick={handleButtonClick} />
      </div>
    </div>
  );
}