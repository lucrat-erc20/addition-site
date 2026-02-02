// app/components/Calculator.tsx

'use client';

import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';
import { useCalculatorStore } from '@/store/calculatorStore';

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
    // Handle empty special button
    if (!value) return;
    
    // Numbers
    if (/^[0-9]$/.test(value)) {
      inputDigit(value);
      return;
    }
    
    // Decimal point
    if (value === '.') {
      inputDecimal();
      return;
    }
    
    // Operators
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
    
    // Equals
    if (value === '=') {
      calculate();
      return;
    }
    
    // Clear functions
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
    
    // Advanced functions
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

  return (
    <div className="inline-block p-[20px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700">
      {/* Display: 43x9 units = 344px x 72px */}
      <div style={{ width: '344px', height: '72px', marginBottom: '16px' }}>
        <Display 
          value={display} 
          operator={currentOperator} 
          hasError={hasError} 
        />
      </div>
      
      {/* Button Grid */}
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
}