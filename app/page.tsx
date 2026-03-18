// app/page.tsx

import Calculator from './components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-start pt-12 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-2">Addition.site</h1>
        <p className="text-gray-400 mb-8">Your Modern Calculator</p>
        <Calculator />

        {/* Adsterra banner - locked to calculator width */}
        <div className="mt-12" style={{ width: '384px' }}>
          <div id="container-38d4986bf6dea79bb7233722f8c2b358" />
        </div>
      </div>
    </main>
  );
}