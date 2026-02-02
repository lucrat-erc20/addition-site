// src/components/ui/ButtonGrid.tsx

'use client';

import Button from './Button';

interface ButtonGridProps {
  onButtonClick: (value: string) => void;
}

export default function ButtonGrid({ onButtonClick }: ButtonGridProps) {
  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '←']
  ];

  return (
    <div className="space-y-3">
      {buttons.map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-3">
          {row.map((btn) => (
            <Button
              key={btn}
              value={btn}
              onClick={() => onButtonClick(btn)}
              variant={
                btn === '=' ? 'equals' :
                ['/', '*', '-', '+'].includes(btn) ? 'operator' :
                ['C', '←'].includes(btn) ? 'function' :
                'number'
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}