import { describe, expect, it } from 'vitest';
import { groupSentences, introToParagraphs, splitSentences } from '../src/lib/split-prose';

describe('splitSentences', () => {
  it('splits on sentence boundaries', () => {
    const text = 'First sentence. Second sentence. Third here.';
    expect(splitSentences(text)).toEqual([
      'First sentence.',
      'Second sentence.',
      'Third here.',
    ]);
  });
});

describe('introToParagraphs', () => {
  it('splits a single intro paragraph into multiple blocks', () => {
    const html =
      '<p>One. Two. Three. Four.</p>';
    const paras = introToParagraphs(html);
    expect(paras.length).toBeGreaterThanOrEqual(2);
    expect(paras.join(' ')).toContain('One.');
    expect(paras.join(' ')).toContain('Four.');
  });

  it('keeps multiple existing paragraphs', () => {
    const html = '<p>Alpha.</p><p>Beta.</p>';
    expect(introToParagraphs(html)).toEqual(['Alpha.', 'Beta.']);
  });
});

describe('groupSentences', () => {
  it('fills groups in order', () => {
    expect(groupSentences(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});