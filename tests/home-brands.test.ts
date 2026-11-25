import { describe, expect, it } from 'vitest';
import { homeTopBrands } from '../src/lib/home-brands';

describe('homeTopBrands', () => {
  it('lists unique manufacturers from current #1 picks', () => {
    const brands = homeTopBrands();
    const names = brands.map((b) => b.name);
    expect(names).toEqual([
      'Tefal',
      'Xiaomi',
      'Origin',
      'Dyson',
      'Apple',
      'Cetaphil',
      'Bosch',
      'TCL',
      'Nike',
    ]);
    expect(new Set(names).size).toBe(names.length);
    for (const brand of brands) {
      expect(brand.src).toBe(`/images/brands/${brand.slug}.svg`);
    }
  });
});