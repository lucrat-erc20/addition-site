// app/components/Calculator.tsx

'use client';

import { useCallback } from 'react';
import Display from './ui/Display';
import ButtonGrid from './ui/ButtonGrid';
import CarbonFibreBackground from './ui/CarbonFibreBackground';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useSensoryStore } from '@/store/sensoryStore';
import { useSensoryAudio } from '@/hooks/useSensoryAudio';
import { useCarbonStore } from '@/store/carbonStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { CABLES } from './ui/SensoryDrive';

interface CalculatorProps {
  calcPortRefs: React.RefObject<HTMLDivElement | null>[];
}

export default function Calculator({ calcPortRefs }: CalculatorProps) {
  const {
    display, currentOperator, hasError,
    inputDigit, inputDecimal, inputOperator,
    calculate, clear, clearAll, backspace,
    toggleSign, percentage, square, squareRoot, reciprocal,
  } = useCalculatorStore();

  const { connected, toggleCable } = useSensoryStore();
  const { play, playConnectionPop } = useSensoryAudio();
  const { nudge } = useCarbonStore();

  const handleButtonClick = useCallback((value: string) => {
    if (!value) return;
    play();
    nudge();
    const fn = (window as unknown as Record<string, () => void>).__sensoryTriggerLED;
    fn?.();

    if (/^[0-9]$/.test(value))  { inputDigit(value); return; }
    if (value === '.')           { inputDecimal(); return; }
    if (value === '+')           { inputOperator('+'); return; }
    if (value === '-')           { inputOperator('-'); return; }
    if (value === 'x')           { inputOperator('*'); return; }
    if (value === '÷')           { inputOperator('/'); return; }
    if (value === '=')           { calculate(); return; }
    if (value === 'C')           { clear(); return; }
    if (value === 'AC')          { clearAll(); return; }
    if (value === '⌫')          { backspace(); return; }
    if (value === '±')           { toggleSign(); return; }
    if (value === '%')           { percentage(); return; }
    if (value === 'x²')         { square(); return; }
    if (value === '√')          { squareRoot(); return; }
    if (value === '1/x')         { reciprocal(); return; }
  }, [play, nudge, inputDigit, inputDecimal, inputOperator, calculate, clear, clearAll, backspace, toggleSign, percentage, square, squareRoot, reciprocal]);

  useKeyboard(handleButtonClick);

  const handlePortClick = useCallback((i: number) => {
    toggleCable(i);
    playConnectionPop(!connected[i]);
  }, [toggleCable, playConnectionPop, connected]);

  return (
    <div
      className="inline-block relative rounded-3xl shadow-2xl border border-gray-700 overflow-visible"
      style={{ padding: '20px' }}
    >
      <CarbonFibreBackground />

      <div className="relative z-10">
        <div style={{ width: '344px', height: '72px', marginBottom: '16px' }}>
          <Display value={display} operator={currentOperator} hasError={hasError} />
        </div>

        <ButtonGrid onButtonClick={handleButtonClick} />

        {/* Cable port holes — bottom of calculator */}
        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {CABLES.map((cab, i) => (
            <div key={i} ref={calcPortRefs[i]}>
              <div
                onClick={() => handlePortClick(i)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                {/* Port hole */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', position: 'relative',
                  background: connected[i]
                    ? 'radial-gradient(circle at 38% 38%, #2a2a2a, #111)'
                    : 'radial-gradient(circle at 38% 38%, #1a1a1a, #050505)',
                  border: `2px solid ${connected[i] ? cab.color : '#2a2a2a'}`,
                  boxShadow: connected[i] ? '0 0 8px rgba(0,0,0,0.8)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{
                    width: connected[i] ? 7 : 9, height: connected[i] ? 7 : 9,
                    borderRadius: '50%',
                    background: connected[i] ? cab.color : '#050505',
                    border: connected[i] ? 'none' : '1px solid #1a1a1a',
                    boxShadow: connected[i] ? `0 0 4px ${cab.color}` : 'none',
                    transition: 'all 0.2s',
                  }} />
                  {connected[i] && (
                    <div style={{
                      position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                      background: 'conic-gradient(#444 0deg, #222 90deg, #555 180deg, #333 270deg)',
                      border: '1px solid #444',
                    }} />
                  )}
                </div>
                {/* Short cable stub dropping down */}
                <div style={{
                  width: 6, height: connected[i] ? 28 : 0,
                  background: `linear-gradient(to bottom, ${cab.color}, transparent)`,
                  borderRadius: '0 0 3px 3px',
                  opacity: 0.7,
                  transition: 'height 0.2s',
                }} />
                <span style={{
                  fontSize: '0.38rem', letterSpacing: '0.08em',
                  color: cab.labelColor, textTransform: 'uppercase',
                  marginTop: 2,
                }}>
                  {cab.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}