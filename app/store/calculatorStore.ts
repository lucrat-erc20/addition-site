// app/store/calculatorStore.ts

import { create } from 'zustand';

type Operator = '+' | '-' | '*' | '/' | null;

interface CalculatorState {
  // Display state
  display: string;
  previousValue: number | null;
  currentOperator: Operator;
  waitingForOperand: boolean;
  hasError: boolean;
  
  // History for recording/playback
  history: string[];
  
  // Actions
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  inputOperator: (operator: '+' | '-' | '*' | '/') => void;
  calculate: () => void;
  clear: () => void;
  clearAll: () => void;
  backspace: () => void;
  toggleSign: () => void;
  percentage: () => void;
  
  // Advanced functions (for future scientific calculator)
  square: () => void;
  squareRoot: () => void;
  reciprocal: () => void;
  
  // Recording
  addToHistory: (action: string) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Initial state
  display: '0',
  previousValue: null,
  currentOperator: null,
  waitingForOperand: false,
  hasError: false,
  history: [],
  
  // Input a digit (0-9)
  inputDigit: (digit: string) => {
    const { display, waitingForOperand } = get();
    
    if (waitingForOperand) {
      set({ display: digit, waitingForOperand: false });
    } else {
      // Limit to 10 characters
      if (display.length >= 10) return;
      set({ display: display === '0' ? digit : display + digit });
    }
    
    get().addToHistory(digit);
  },
  
  // Input decimal point
  inputDecimal: () => {
    const { display, waitingForOperand } = get();
    
    if (waitingForOperand) {
      set({ display: '0.', waitingForOperand: false });
    } else if (display.indexOf('.') === -1) {
      if (display.length >= 10) return;
      set({ display: display + '.' });
    }
    
    get().addToHistory('.');
  },
  
  // Input operator (+, -, *, /)
   inputOperator: (operator: '+' | '-' | '*' | '/') => {
    const { display, previousValue, currentOperator, waitingForOperand } = get();
    const inputValue = parseFloat(display);
    
    // If we just pressed an operator, allow changing it
    if (waitingForOperand && previousValue !== null) {
      set({ currentOperator: operator });
      get().addToHistory(operator);
      return;
    }
    
    if (previousValue === null) {
      set({ previousValue: inputValue });
    } else if (currentOperator) {
      // Perform the pending calculation
      const currentValue = parseFloat(get().display);
      const { add, subtract, multiply, divide } = require('@/lib/calculations/basic');
      
      let result: number;
      
      switch (currentOperator) {
        case '+':
          result = add(previousValue, currentValue);
          break;
        case '-':
          result = subtract(previousValue, currentValue);
          break;
        case '*':
          result = multiply(previousValue, currentValue);
          break;
        case '/':
          result = divide(previousValue, currentValue);
          break;
        default:
          result = currentValue;
      }
      
      // Check for errors
      if (!isFinite(result)) {
        set({ 
          display: 'Error', 
          hasError: true,
          previousValue: null,
          currentOperator: null,
          waitingForOperand: true
        });
        return;
      }
      
      // Format result
      const resultStr = String(result);
      let displayStr: string;
      
      if (resultStr.length > 10 || Math.abs(result) < 0.0001 || Math.abs(result) > 999999999) {
        displayStr = result.toExponential(4);
      } else {
        displayStr = resultStr.slice(0, 10);
      }
      
      set({ previousValue: result, display: displayStr });
    }
    
    set({ 
      waitingForOperand: true, 
      currentOperator: operator 
    });
    
    get().addToHistory(operator);
  },
  
  // Calculate result (=)
  calculate: () => {
    const { display, previousValue, currentOperator } = get();
    const inputValue = parseFloat(display);
    
    if (previousValue === null || currentOperator === null) {
      return inputValue;
    }
    
    // Import calculation functions
    const { add, subtract, multiply, divide } = require('@/lib/calculations/basic');
    
    let result: number;
    
    try {
      switch (currentOperator) {
        case '+':
          result = add(previousValue, inputValue);
          break;
        case '-':
          result = subtract(previousValue, inputValue);
          break;
        case '*':
          result = multiply(previousValue, inputValue);
          break;
        case '/':
          result = divide(previousValue, inputValue);
          break;
        default:
          result = inputValue;
      }
      
      // Check for errors (like division by zero)
      if (!isFinite(result)) {
        set({ 
          display: 'Error', 
          hasError: true,
          previousValue: null,
          currentOperator: null,
          waitingForOperand: true
        });
        return 0;
      }
      
      // Limit result to 10 characters
      const resultStr = String(result);
      const displayStr = resultStr.length > 10 ? result.toExponential(4) : resultStr;
      
      set({
        display: displayStr,
        previousValue: null,
        currentOperator: null,
        waitingForOperand: true,
        hasError: false
      });
      
      get().addToHistory('=');
      return result;
      
    } catch (error) {
      set({ 
        display: 'Error', 
        hasError: true,
        previousValue: null,
        currentOperator: null,
        waitingForOperand: true
      });
      return 0;
    }
  },
  
  // Clear current entry (C)
  clear: () => {
    set({ display: '0', hasError: false });
    get().addToHistory('C');
  },
  
  // Clear all (AC)
  clearAll: () => {
    set({
      display: '0',
      previousValue: null,
      currentOperator: null,
      waitingForOperand: false,
      hasError: false
    });
    get().addToHistory('AC');
  },
  
  // Backspace (⌫)
  backspace: () => {
    const { display } = get();
    if (display.length > 1) {
      set({ display: display.slice(0, -1) });
    } else {
      set({ display: '0' });
    }
    get().addToHistory('⌫');
  },
  
  // Toggle sign (±)
  toggleSign: () => {
    const { display } = get();
    const value = parseFloat(display);
    set({ display: String(-value) });
    get().addToHistory('±');
  },
  
  // Percentage (%)
  percentage: () => {
    const { display } = get();
    const value = parseFloat(display);
    set({ display: String(value / 100) });
    get().addToHistory('%');
  },
  
// Square (x²)
  square: () => {
    const { display } = get();
    const { square } = require('@/lib/calculations/advanced');
    const value = parseFloat(display);
    const result = square(value);
    
    // Format result properly
    const resultStr = String(result);
    let displayStr: string;
    
    if (resultStr.length > 10 || Math.abs(result) > 999999999) {
      displayStr = result.toExponential(4);
    } else {
      displayStr = resultStr.slice(0, 10);
    }
    
    set({ display: displayStr, waitingForOperand: true });
    get().addToHistory('x²');
  },
  
  // Square root (√)
  squareRoot: () => {
    const { display } = get();
    const { squareRoot } = require('@/lib/calculations/advanced');
    const value = parseFloat(display);
    const result = squareRoot(value);
    
    if (isNaN(result)) {
      set({ display: 'Error', hasError: true, waitingForOperand: true });
    } else {
      // Format result properly
      const resultStr = String(result);
      let displayStr: string;
      
      if (resultStr.length > 10 || Math.abs(result) < 0.0001 || Math.abs(result) > 999999999) {
        displayStr = result.toExponential(4);
      } else {
        displayStr = resultStr.slice(0, 10);
      }
      
      set({ display: displayStr, waitingForOperand: true });
    }
    get().addToHistory('√');
  },
  
  // Reciprocal (1/x)
  reciprocal: () => {
    const { display } = get();
    const { reciprocal } = require('@/lib/calculations/advanced');
    const value = parseFloat(display);
    const result = reciprocal(value);
    
    if (!isFinite(result)) {
      set({ display: 'Error', hasError: true, waitingForOperand: true });
    } else {
      // Format result properly - use exponential if too large/small
      const resultStr = String(result);
      let displayStr: string;
      
      if (resultStr.length > 10 || Math.abs(result) < 0.0001 || Math.abs(result) > 999999999) {
        displayStr = result.toExponential(4);
      } else {
        displayStr = resultStr.slice(0, 10);
      }
      
      set({ display: displayStr, waitingForOperand: true });
    }
    get().addToHistory('1/x');
  },
  
  // Recording actions for playback
  addToHistory: (action: string) => {
    const { history } = get();
    set({ history: [...history, action] });
  },
  
  clearHistory: () => {
    set({ history: [] });
  }
}));