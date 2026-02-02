// src/components/ui/Button.tsx

'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  value: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'equals' | 'function';
}

export default function Button({ value, onClick, variant = 'number' }: ButtonProps) {
  const baseStyles = "h-16 rounded-lg font-semibold text-xl transition-all duration-150 active:scale-95";
  
  const variantStyles = {
    number: "bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl",
    operator: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl",
    equals: "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-xl col-span-2",
    function: "bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {value}
    </motion.button>
  );
}