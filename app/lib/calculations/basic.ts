// app/lib/calculations/basic.ts

/**
 * Basic arithmetic operations
 * Pure functions - calculator agnostic
 * Can be used by ANY calculator type (basic, scientific, financial, etc.)
 */

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    return Infinity; // Division by zero - caller handles error display
  }
  return a / b;
}