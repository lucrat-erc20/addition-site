'use client';

// app/components/AdSlot.tsx

import { useEffect, useRef } from 'react';

const AD_SRC = 'https://pl28937198.profitablecpmratenetwork.com/38d4986bf6dea79bb7233722f8c2b358/invoke.js';
const AD_ID  = 'container-38d4986bf6dea79bb7233722f8c2b358';

export default function AdSlot({ index }: { index: number }) {
  const containerId = `${AD_ID}-${index}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create the container div Adsterra targets
    const container = document.createElement('div');
    container.id = containerId;
    ref.current.appendChild(container);

    // Dynamically inject a fresh script tag per slot — forces re-execution
    // (browsers won't re-run the same script src twice if loaded statically)
    const script = document.createElement('script');
    script.src = AD_SRC;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    ref.current.appendChild(script);

    return () => {
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [containerId]);

  return (
    <div
      ref={ref}
      style={{
        margin: '32px 0',
        padding: '16px',
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: 8,
        minHeight: 90,
      }}
    />
  );
}