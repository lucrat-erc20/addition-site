// app/components/ui/Display.tsx

interface DisplayProps {
  value: string;
  operator?: '+' | '-' | '*' | '/' | null;
  hasError?: boolean;
}

export default function Display({ value, operator = null, hasError = false }: DisplayProps) {
  // Limit to 10 characters
  const displayValue = value.slice(0, 10);
  
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-600/40 w-full h-full p-3 flex flex-col justify-between">
      {/* Top status bar - icons and indicators */}
      <div className="flex items-center justify-between h-[16px]">
        {/* 
          LEFT PLACEHOLDER AREA - Brand/Calculator Type Indicators
          Use these areas for calculator-specific branding or mode indicators
          Example uses: "SCIENTIFIC", "TAX", "FINANCE" badges, or brand logos
        */}
        <div className="flex gap-2">
          {/* PLACEHOLDER_LOGO_LARGE: 24px wide - main branding area */}
          <div className="w-[24px] h-[12px] border border-gray-600/30 rounded"></div>
          {/* PLACEHOLDER_LOGO_SMALL: 12px wide - secondary indicator */}
          <div className="w-[12px] h-[12px] border border-gray-600/30 rounded"></div>
        </div>
        
        {/* 
          CENTER AREA - Active Operator Indicators
          Shows which mathematical operation is currently selected
          Lights up green when operator button is pressed
        */}
        <div className="flex gap-3 text-xs font-mono text-gray-500">
          <span className={operator === '+' ? 'text-green-400' : ''}>+</span>
          <span className={operator === '-' ? 'text-green-400' : ''}>-</span>
          <span className={operator === '*' ? 'text-green-400' : ''}>×</span>
          <span className={operator === '/' ? 'text-green-400' : ''}>÷</span>
        </div>
        
        {/* 
          RIGHT PLACEHOLDER AREA - Status Indicators
          Use these for calculator state indicators
        */}
        <div className="flex gap-2">
          {/* ERROR_INDICATOR: Shows 'E' in red when calculation error occurs */}
          <span className={`text-xs font-mono ${hasError ? 'text-red-400' : 'text-gray-700'}`}>E</span>
          {/* PLACEHOLDER_STATUS: 12px wide - battery, memory, or other status */}
          <div className="w-[12px] h-[12px] border border-gray-600/30 rounded"></div>
        </div>
      </div>
      
      {/* Main number display - bottom-right aligned, monospaced */}
      <div className="flex items-end justify-end">
        <div 
          className="text-white tracking-widest tabular-nums leading-none"
          style={{
            fontFamily: '"Roboto Mono", "Courier New", monospace',
            fontWeight: 400,
            fontSize: '2.25rem', // ~36px - reduced from 2.5rem for better fit
            letterSpacing: '0.05em'
          }}
        >
          {displayValue}
        </div>
      </div>
    </div>
  );
}