// app/full-amp-interest/page.tsx
'use client';

import { useState } from 'react';

export default function FullAmpInterest() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
          Full Amp Calculator
        </h1>
        <p className="text-gray-400 mb-2">A full guitar-amp style sound engine — pitch, tone, reverb, drive, and more — built into the calculator.</p>
        <p className="text-yellow-500 text-sm mb-8">Coming soon. Leave your email and we'll let you know when it drops.</p>

        {submitted ? (
          <div className="bg-gray-800 border border-yellow-600 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">🎸</div>
            <p className="text-white font-medium">You're on the list.</p>
            <p className="text-gray-400 text-sm mt-1">We'll email you when Full Amp launches.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
            <button
              onClick={() => { if (email) setSubmitted(true); }}
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg px-4 py-3 transition-colors"
            >
              Notify me when it's ready
            </button>
            <a href="/" className="text-gray-500 text-sm text-center hover:text-gray-300 transition-colors">
              ← back to calculator
            </a>
          </div>
        )}
      </div>
    </main>
  );
}