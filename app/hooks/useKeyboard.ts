// app/hooks/useKeyboard.ts

import { useEffect } from 'react';

type KeyHandler = (key: string) => void;

export function useKeyboard(handler: KeyHandler) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Prevent default for calculator keys
      if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', 'Enter', 'Escape', 'Backspace'].includes(key)) {
        event.preventDefault();
      }
      
      // Number keys
      if (/^[0-9]$/.test(key)) {
        handler(key);
        return;
      }
      
      // Operators
      if (key === '+') {
        handler('+');
        return;
      }
      if (key === '-') {
        handler('-');
        return;
      }
      if (key === '*') {
        handler('x');
        return;
      }
      if (key === '/') {
        handler('÷');
        return;
      }
      
      // Decimal
      if (key === '.') {
        handler('.');
        return;
      }
      
      // Enter = equals
      if (key === 'Enter' || key === '=') {
        handler('=');
        return;
      }
      
      // Escape = clear
      if (key === 'Escape') {
        handler('AC');
        return;
      }
      
      // Backspace
      if (key === 'Backspace') {
        handler('⌫');
        return;
      }
      
      // Delete = clear
      if (key === 'Delete') {
        handler('C');
        return;
      }
      
      // Percent
      if (key === '%') {
        handler('%');
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handler]);
}