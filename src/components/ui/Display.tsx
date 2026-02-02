// src/components/Display.tsx

interface DisplayProps {
  value: string;
}

export default function Display({ value }: DisplayProps) {
  return (
    <div className="bg-gray-950 rounded-lg p-6 mb-6 border-2 border-gray-700 shadow-inner">
      <div className="text-right text-5xl font-mono text-green-400 tracking-wider min-h-[60px] flex items-center justify-end">
        {value}
      </div>
    </div>
  );
}