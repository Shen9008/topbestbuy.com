import { test, expect } from '@playwright/test';

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