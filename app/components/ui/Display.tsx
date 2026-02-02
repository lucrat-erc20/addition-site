// app/components/ui/Display.tsx

interface DisplayProps {
  value: string;
}

export default function Display({ value }: DisplayProps) {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-600/40">
      <div 
        className="text-right text-white text-4xl tracking-wide flex items-center justify-end pr-4"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontWeight: 300
        }}
      >
        {value}
      </div>
    </div>
  );
}