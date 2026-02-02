// app/components/ui/Button.tsx

'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  value: string;
  onClick: () => void;
  variant?: 'number' | 'function' | 'clear' | 'special';
  isEmpty?: boolean;
}

export default function Button({ value, onClick, variant = 'number', isEmpty = false }: ButtonProps) {
  const baseStyles = "rounded-xl font-thin text-white text-lg flex items-center justify-center transition-all duration-150 active:scale-95 border border-gray-500/30";
  
  const variantStyles = {
    number: "bg-gradient-to-r from-[#999999] to-[#666666]",
    function: "bg-gradient-to-r from-[#474747] to-[#1a1a1a]",
    clear: "bg-gradient-to-r from-[#6da431] to-[#99cc99]",
    special: "bg-gradient-to-r from-[#e67814] to-[#fa9664]"
  };

  if (isEmpty) {
    return <div className={baseStyles + " bg-gradient-to-r from-[#e67814] to-[#fa9664] opacity-50"} />;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        fontWeight: 300
      }}
    >
      {value}
    </motion.button>
  );
}