// app/components/ui/CarbonFibreBackground.tsx

/**
 * Carbon fibre pattern background
 * Values are driven by carbonStore - smoothly lerps on each keypress
 * tileSize locked at 7
 * 
 * Ranges:
 *   A1: 22→32, A2: 15→21
 *   B1: 26→36, B2: 9→15
 */

'use client';

import { useEffect } from 'react';
import { useCarbonStore } from '@/store/carbonStore';

export default function CarbonFibreBackground() {
  const { tileSize, A1, A2, B1, B2, startLoop, stopLoop } = useCarbonStore();

  // Start/stop animation loop on mount/unmount
  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, [startLoop, stopLoop]);

  const half = tileSize / 2;

  return (
    <svg
      className="absolute inset-0 w-full h-full rounded-3xl"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="quadA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${A1.current},${A1.current},${A1.current})`} />
          <stop offset="100%" stopColor={`rgb(${A2.current},${A2.current},${A2.current})`} />
        </linearGradient>

        <linearGradient id="quadB" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${B1.current},${B1.current},${B1.current})`} />
          <stop offset="100%" stopColor={`rgb(${B2.current},${B2.current},${B2.current})`} />
        </linearGradient>

        <pattern id="carbonTile" x="0" y="0" width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={half} height={half} fill="url(#quadA)" />
          <rect x={half} y="0" width={half} height={half} fill="url(#quadB)" />
          <rect x="0" y={half} width={half} height={half} fill="url(#quadB)" />
          <rect x={half} y={half} width={half} height={half} fill="url(#quadA)" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" rx="24" fill="#111111" />
      <rect width="100%" height="100%" rx="24" fill="url(#carbonTile)" />
    </svg>
  );
}