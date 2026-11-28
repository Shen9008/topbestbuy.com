import { expect, test } from '@playwright/test';

test('the phone header fits and Browse opens the category index', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/');
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await expect(page.locator('header a[href="/saved"]')).toBeInViewport({ ratio: 1 });
  await page.getByRole('navigation', { name: 'Mobile primary' }).getByRole('link', { name: 'Browse' }).click();
  await expect(page).toHaveURL(/\/categories$/);
});

test('the tablet category menu stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 650 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Browse categories' });
  await trigger.click();
  await expect(page.getByRole('region', { name: 'Top 10 lists' })).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('quick search gives the input focus and restores it on Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('#open-search');
  await page.locator('astro-island[ssr]:has(dialog)').waitFor({ state: 'detached' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const input = dialog.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('air fryer');
  await expect(dialog.getByRole('link', { name: /air fryer/i }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('saved products open in the comparison picker', async ({ page }) => {
  const ids = ['tefal-easy-fry-mega-ey855d', 'philips-3000-72l'];
  await page.addInitScript((products) => {
    localStorage.setItem('tb-shortlist', JSON.stringify(products));
  }, ids);
  await page.goto('/saved');
  await page.getByRole('link', { name: 'Compare saved products' }).click();
  await expect(page.getByRole('combobox', { name: 'Product 1' })).toHaveValue(ids[0]);
  await expect(page.getByRole('combobox', { name: 'Product 2' })).toHaveValue(ids[1]);
  await expect(page.getByRole('table')).toBeVisible();
});
