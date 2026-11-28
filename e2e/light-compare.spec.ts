import { test, expect, type Locator } from '@playwright/test';
import sharp from 'sharp';
import { contrastRatio } from '../src/lib/color-contrast';

async function lowestRenderedContrast(text: Locator) {
  const { foreground, clip } = await text.evaluate((element) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
    const context = document.createElement('canvas').getContext('2d')!;
    context.fillStyle = getComputedStyle(element).color;
    context.fillRect(0, 0, 1, 1);
    const { x, y, width, height } = element.getBoundingClientRect();
    element.style.setProperty('-webkit-text-fill-color', 'transparent');
    return {
      foreground: Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3)),
      clip: { x, y, width, height },
    };
  });
  const background = await text.page().screenshot({ clip }).finally(() =>
    text.evaluate((element) => element.style.removeProperty('-webkit-text-fill-color')),
  );
  const { data, info } = await sharp(background).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const foregroundHex = Buffer.from(foreground).toString('hex');
  let minimum = Infinity;
  for (let y = 4; y < info.height - 4; y += 2) {
    for (let x = 4; x < info.width - 4; x += 2) {
      const offset = (y * info.width + x) * info.channels;
      minimum = Math.min(minimum, contrastRatio(foregroundHex, data.toString('hex', offset, offset + 3)));
    }
  }
  return minimum;
}

test('the tool action stays legible in both themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const tool = page.getByRole('link', { name: /Product finder.*Open tool/i }).first();
  const action = tool.getByText('Open tool', { exact: false });

  for (const theme of ['light', 'dark']) {
    await page.evaluate((mode) => { document.documentElement.dataset.theme = mode; }, theme);
    expect(await lowestRenderedContrast(action)).toBeGreaterThanOrEqual(4.5);
  }
  await expect(tool).toHaveAttribute('href', '/tools?tool=finder');
});

test.describe('light theme list compare section', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tb-theme', 'light');
      document.documentElement.dataset.theme = 'light';
    });
    await page.goto('/best-washing-machines-malaysia#sec-compare');
    await page.locator('#sec-compare').waitFor({ state: 'visible' });
    await page.locator('#sec-compare .tb-chip').first().waitFor({ state: 'visible' });
  });

  test('compare heading, chips, and table cells use dark ink on light surfaces', async ({ page }) => {
    const section = page.locator('#sec-compare');
    const isDarkInk = async (locator: ReturnType<typeof page.locator>) =>
      locator.evaluate((el) => {
        const probe = document.createElement('span');
        probe.style.color = getComputedStyle(el).color;
        document.body.appendChild(probe);
        const rgb = getComputedStyle(probe).color;
        probe.remove();
        const m = rgb.match(/(\d+)/g);
        if (!m || m.length < 3) return false;
        const [r, g, b] = m.map(Number);
        const y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return y < 0.45;
      });

    const heading = section.getByRole('heading', { name: 'Compare at a glance' });
    await expect(heading).toBeVisible();
    expect(await isDarkInk(heading)).toBe(true);

    const chip = section.locator('.tb-chip:not(.tb-chip-on)').first();
    expect(await isDarkInk(chip)).toBe(true);

    const cell = section.locator('#cmp-table tbody tr').first().locator('td').nth(2);
    expect(await isDarkInk(cell)).toBe(true);
  });
});

for (const theme of ['light', 'dark'] as const) {
  for (const transparency of ['no-preference', 'reduce'] as const) {
    test(`editorial bands keep readable text in ${theme} theme with ${transparency} transparency`, async ({ page }) => {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-reduced-transparency', value: transparency },
          { name: 'prefers-reduced-motion', value: 'reduce' },
        ],
      });
      await page.addInitScript((mode) => localStorage.setItem('tb-theme', mode), theme);
      await page.goto('/');
      expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(transparency === 'reduce');
      const methodology = page.getByRole('region', { name: 'Three steps, all public' });
      const homeCopy = [
        methodology.getByRole('heading', { name: 'Three steps, all public' }),
        methodology.getByText('How a list is made'),
        methodology.getByRole('link', { name: 'Read the full scorecard' }),
        methodology.getByText('Seven criteria with fixed weights', { exact: false }),
      ];
      for (const copy of homeCopy) {
        expect(await lowestRenderedContrast(copy), await copy.innerText()).toBeGreaterThanOrEqual(4.5);
      }

      await page.goto('/best-washing-machines-malaysia');
      const compare = page.locator('#sec-compare');
      await compare.locator('astro-island[ssr]').waitFor({ state: 'detached' });
      const compareCopy = [
        compare.getByRole('heading', { name: 'Compare at a glance' }),
        compare.locator('.tb-chip:not(.tb-chip-on)').first(),
        compare.locator('#cmp-table tbody tr').first().locator('td').nth(2).locator('strong'),
      ];
      for (const copy of compareCopy) {
        expect(await lowestRenderedContrast(copy), await copy.innerText()).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
}
