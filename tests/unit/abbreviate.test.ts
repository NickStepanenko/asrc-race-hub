import { describe, it, expect } from 'vitest';
import { abbreviateLastName } from '@/app/components/CarElement';

describe('abbreviateLastName', () => {
  it('returns first 3 letters uppercase', () => {
    expect(abbreviateLastName('Smith')).toBe('SMI');
  });

  it('pads short names', () => {
    expect(abbreviateLastName('A')).toBe('AAA');
  });

  it('removes non letters', () => {
    expect(abbreviateLastName("O'Neal")).toBe('ONE');
  });

  it('handles empty string', () => {
    expect(abbreviateLastName('')).toBe('XXX');
  });
});