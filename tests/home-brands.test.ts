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
    expect(brands.find((b) => b.slug === 'cetaphil')?.src).toBe('/images/brands/cetaphil.webp');
    expect(brands.find((b) => b.slug === 'origin')?.src).toBe('/images/brands/origin.webp');
    expect(brands.find((b) => b.slug === 'tcl')?.src).toBe('/images/brands/tcl.webp');
    for (const brand of brands) {
      if (brand.slug === 'cetaphil' || brand.slug === 'origin' || brand.slug === 'tcl') continue;
      expect(brand.src).toBe(`/images/brands/${brand.slug}.svg`);
    }
  });
});