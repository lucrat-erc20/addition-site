// app/lib/calculations/advanced.ts

/**
 * Advanced mathematical operations
 * Used by scientific calculators and other advanced calculator types
 * Pure functions - calculator agnostic
 */

export function square(value: number): number {
  return value * value;
}

export function squareRoot(value: number): number {
  if (value < 0) {
    return NaN; // Caller handles error display
  }
  return Math.sqrt(value);
}

export function reciprocal(value: number): number {
  if (value === 0) {
    return Infinity; // Division by zero - caller handles error
  }
  return 1 / value;
}

export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    return NaN;
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function log(value: number): number {
  if (value <= 0) {
    return NaN;
  }
  return Math.log10(value);
}

export function ln(value: number): number {
  if (value <= 0) {
    return NaN;
  }
  return Math.log(value);
}

export function sin(degrees: number): number {
  return Math.sin(degrees * Math.PI / 180);
}

export function cos(degrees: number): number {
  return Math.cos(degrees * Math.PI / 180);
}

export function tan(degrees: number): number {
  return Math.tan(degrees * Math.PI / 180);
}