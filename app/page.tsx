// app/page.tsx

import Calculator from './components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">Addition.site</h1>
        <p className="text-gray-400 mb-8">Your Modern Calculator</p>
        <Calculator />
      </div>
    </main>
  );
}