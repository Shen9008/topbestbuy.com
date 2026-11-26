/** Split running text into sentences on `. ` / `? ` / `! ` boundaries (keep terminal punctuation). */
export function splitSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘(])/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** Group sentences into at most `maxParagraphs` blocks, filled in document order. */
export function groupSentences(sentences: string[], maxParagraphs = 3): string[][] {
  if (sentences.length === 0) return [];
  if (sentences.length === 1) return [sentences];
  const groups = Math.min(maxParagraphs, sentences.length);
  const perGroup = Math.ceil(sentences.length / groups);
  const out: string[][] = [];
  for (let i = 0; i < sentences.length; i += perGroup) {
    out.push(sentences.slice(i, i + perGroup));
  }
  return out;
}

/** Turn intro HTML into paragraph strings (splits single-`<p>` copy into 2–3 paragraphs). */
export function introToParagraphs(introHtml: string): string[] {
  const trimmed = introHtml.trim();
  if (!trimmed) return [];

  const paragraphMatches = [...trimmed.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  if (paragraphMatches.length > 1) {
    return paragraphMatches.map((m) => m[1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }

  const plain =
    paragraphMatches.length === 1
      ? paragraphMatches[0]![1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : trimmed.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const sentences = splitSentences(plain);
  if (sentences.length <= 2) return [plain];
  return groupSentences(sentences, 3).map((chunk) => chunk.join(' '));
}