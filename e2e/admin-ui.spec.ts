import { test, expect } from '@playwright/test';

test('admin modules stay usable across viewports and themes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/admin/login');
  await page.getByPlaceholder('admin@techvibe.id').fill('admin@techvibe.id');
  await page.getByPlaceholder('••••••••').fill('Admin123!');
  await page.getByRole('button', { name: 'Masuk Sistem' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const dark of [false, true]) {
      const isDarkNow = await page.locator('html').evaluate(el => el.classList.contains('dark'));
      if (dark !== isDarkNow) {
        await page.getByRole('button', { name: 'Ganti tema' }).click();
        await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /^(?!.*\bdark\b).*$/);
      }
      for (const route of ['', '/products', '/orders', '/promos', '/shipping', '/customers', '/tlater-risk', '/points', '/tickets']) {
        await page.goto(`/admin${route}`);
        await expect(page.locator('main')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px ${dark ? 'dark' : 'light'} /admin${route}`).toBe(true);
      }
    }
  }
  expect(errors).toEqual([]);
});
