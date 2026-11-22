import { describe, expect, it } from 'vitest';
import { LISTS } from '../src/data/lists';
import { buildRankedForList, r1, type RankedProduct } from '../src/lib/scoring';
import golden from './golden/ranked.json';

type GoldenRow = {
  id: string;
  rank: number;
  total: number;
  thin: boolean;
  subs: number[];
};

const listKeys = Object.keys(golden) as (keyof typeof golden)[];

function snapshotRow(p: RankedProduct): GoldenRow {
  return {
    id: p.id,
    rank: p.rank,
    total: p.total,
    thin: p.thin,
    subs: p.subs,
  };
}

describe('mockup rank parity (CORE)', () => {
  it.each(listKeys)('ranked order matches mockup for %s', (listKey) => {
    const list = LISTS[listKey as keyof typeof LISTS];
    const ranked = buildRankedForList(listKey, list);
    const expected = golden[listKey] as GoldenRow[];
    expect(ranked.map(snapshotRow)).toEqual(expected);
  });

  it('user-facing totals use one decimal like mockup r1', () => {
    const sample = buildRankedForList(
      'best-air-fryers-malaysia',
      LISTS['best-air-fryers-malaysia'],
    )[0]!;
    expect(r1(sample.total)).toMatch(/^\d+\.\d$/);
  });
});

describe('fragrance derivation (cleansers)', () => {
  it('unknown fragrance does not block fragrance-free matcher filter', () => {
    const ranked = buildRankedForList(
      'best-facial-cleansers-malaysia',
      LISTS['best-facial-cleansers-malaysia'],
    );
    const unknown = ranked.filter((p) => p.fragranceEvidence === 'unknown');
    expect(unknown.length).toBeGreaterThan(0);
    for (const p of unknown) {
      expect(p.fragfree).toBeNull();
    }
  });
});