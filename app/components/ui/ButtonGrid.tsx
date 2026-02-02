// app/components/ui/ButtonGrid.tsx

'use client';

import Button from './Button';

interface ButtonGridProps {
  onButtonClick: (value: string) => void;
}

type ButtonConfig = {
  value: string;
  variant: 'number' | 'function' | 'clear' | 'special';
  isEmpty?: boolean;
};

export default function ButtonGrid({ onButtonClick }: ButtonGridProps) {
  const buttons: ButtonConfig[][] = [
    [
      { value: 'x²', variant: 'function' },
      { value: '√', variant: 'function' },
      { value: '1/x', variant: 'function' },
      { value: '%', variant: 'function' },
      { value: '⌫', variant: 'clear' }
    ],
    [
      { value: '7', variant: 'number' },
      { value: '8', variant: 'number' },
      { value: '9', variant: 'number' },
      { value: 'C', variant: 'clear' },
      { value: 'AC', variant: 'clear' }
    ],
    [
      { value: '4', variant: 'number' },
      { value: '5', variant: 'number' },
      { value: '6', variant: 'number' },
      { value: 'x', variant: 'function' },
      { value: '÷', variant: 'function' }
    ],
    [
      { value: '1', variant: 'number' },
      { value: '2', variant: 'number' },
      { value: '3', variant: 'number' },
      { value: '+', variant: 'function' },
      { value: '-', variant: 'function' }
    ],
    [
      { value: '±', variant: 'function' },
      { value: '0', variant: 'number' },
      { value: '.', variant: 'number' },
      { value: '', variant: 'special', isEmpty: true },
      { value: '=', variant: 'function' }
    ]
  ];

  return (
    <div className="flex flex-col gap-[12px]">
      {buttons.map((row, i) => (
        <div key={i} className="grid grid-cols-5 gap-[8px]">
          {row.map((btn, j) => (
            <div key={j} style={{ width: '56px', height: '40px' }}>
              <Button
                value={btn.value}
                onClick={() => onButtonClick(btn.value)}
                variant={btn.variant}
                isEmpty={btn.isEmpty}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}