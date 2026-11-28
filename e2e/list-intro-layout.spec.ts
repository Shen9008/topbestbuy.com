import { test, expect } from '@playwright/test';

test.describe('list lead intro layout', () => {
  test('three intro notes render as an equal grid on wide viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/best-washing-machines-malaysia');

    const intro = page.getByRole('region', { name: 'How this list was built' });
    await expect(intro).toBeVisible();
    await expect(intro.locator('.tb-list-lead__intro--grid')).toBeVisible();

    const notes = intro.locator('.tb-list-lead__note');
    await expect(notes).toHaveCount(3);

    const firstBox = await notes.nth(0).boundingBox();
    const secondBox = await notes.nth(1).boundingBox();
    const thirdBox = await notes.nth(2).boundingBox();
    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    expect(thirdBox).not.toBeNull();
    expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThan(12);
    expect(Math.abs(secondBox!.y - thirdBox!.y)).toBeLessThan(12);
    expect(secondBox!.x).toBeGreaterThan(firstBox!.x + firstBox!.width * 0.5);
  });
});