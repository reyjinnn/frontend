import { test, expect } from '@playwright/test';

for (const width of [1440, 768, 390]) {
  for (const dark of [false, true]) {
    test(`admin modules stay usable at ${width}px in ${dark ? 'dark' : 'light'} mode`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/admin/login');
      await page.getByPlaceholder('admin@techvibe.id').fill('admin@techvibe.id');
      await page.getByPlaceholder('••••••••').fill('Admin123!');
      await page.getByRole('button', { name: 'Masuk Sistem' }).click();
      await expect(page).toHaveURL(/\/admin$/);
      await expect(page.locator('main h2')).toBeVisible();
      const isDarkNow = await page.locator('html').evaluate(el => el.classList.contains('dark'));
      const toggle = page.getByRole('button', { name: 'Ganti tema' });
      if (dark === isDarkNow) await toggle.click();
      await toggle.click();
      await expect(page.locator('html')).toHaveClass(dark ? /\bdark\b/ : /^(?!.*\bdark\b).*$/);
      for (const route of ['', '/products', '/orders', '/promos', '/shipping', '/customers', '/tlater-risk', '/points', '/tickets']) {
        await test.step(`/admin${route}`, async () => {
          await page.goto(`/admin${route}`);
          await expect(page.getByRole('button', { name: 'Ganti tema' })).toBeVisible();
          await expect(page.locator('main h2')).toBeVisible();
          await expect(page.getByText('Memuat data...', { exact: true })).toHaveCount(0);
          await expect(page.locator('html')).toHaveClass(dark ? /\bdark\b/ : /^(?!.*\bdark\b).*$/);
          expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(dark ? 'dark' : 'light');
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        });
      }
      expect(errors).toEqual([]);
    });
  }
}
