import { test, expect } from '@playwright/test';

const errors = (page: import('@playwright/test').Page) => {
  const messages: string[] = [];
  page.on('pageerror', error => messages.push(error.message));
  return messages;
};

test('guest privacy and customer login survive refresh', async ({ page }) => {
  const failures = errors(page);
  await page.goto('/profile');
  await expect(page.getByRole('heading', { name: 'Selamat Datang!' })).toBeVisible();
  await expect(page.getByText('Masuk untuk melanjutkan', { exact: true })).toBeVisible();
  await expect(page.getByText('Budi Santoso')).toHaveCount(0);
  await page.getByPlaceholder('Email').fill('budi@example.com');
  await page.getByPlaceholder('Password').fill('Demo123!');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: 'Selamat Datang!' })).toBeHidden();
  await page.reload();
  await expect(page.getByText('Masuk untuk melanjutkan', { exact: true })).toHaveCount(0);
  expect(failures).toEqual([]);
});

test('invalid admin credentials rejected, valid admin persists in tab', async ({ page }) => {
  const failures = errors(page);
  await page.goto('/admin/login');
  await page.getByPlaceholder('admin@techvibe.id').fill('admin@techvibe.id');
  await page.getByPlaceholder('••••••••').fill('wrong-password');
  await page.getByRole('button', { name: 'Masuk Sistem' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  await page.getByPlaceholder('••••••••').fill('Admin123!');
  await page.getByRole('button', { name: 'Masuk Sistem' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.reload();
  await expect(page).toHaveURL(/\/admin$/);
  expect(failures).toEqual([]);
});

test('two tabs: customer and admin sessions isolated, business database shared', async ({ browser }) => {
  const context = await browser.newContext();
  const customer = await context.newPage();
  const admin = await context.newPage();
  const customerErrors = errors(customer);
  const adminErrors = errors(admin);
  await customer.goto('/');
  await customer.getByRole('button', { name: 'Masuk', exact: true }).first().click();
  await customer.getByPlaceholder('Email').fill('budi@example.com');
  await customer.getByPlaceholder('Password').fill('Demo123!');
  await customer.locator('form button[type="submit"]').click();
  await admin.goto('/admin/login');
  await admin.getByPlaceholder('admin@techvibe.id').fill('admin@techvibe.id');
  await admin.getByPlaceholder('••••••••').fill('Admin123!');
  await admin.getByRole('button', { name: 'Masuk Sistem' }).click();
  await customer.goto('/profile');
  await admin.goto('/admin');
  await expect(admin).toHaveURL(/\/admin$/);
  await expect(customer.getByText('Masuk untuk melanjutkan', { exact: true })).toHaveCount(0);
  const customerDb = await customer.evaluate(() => localStorage.getItem('techvibe.demo.db.v1'));
  const adminDb = await admin.evaluate(() => localStorage.getItem('techvibe.demo.db.v1'));
  expect(customerDb).toBe(adminDb);
  const customerSession = await customer.evaluate(() => sessionStorage.getItem('techvibe.session'));
  const adminSession = await admin.evaluate(() => sessionStorage.getItem('techvibe.session'));
  expect(customerSession).not.toBe(adminSession);
  expect(customerErrors).toEqual([]);
  expect(adminErrors).toEqual([]);
  await context.close();
});

test('catalog deep route loads at desktop/tablet/mobile in both themes', async ({ page }) => {
  const failures = errors(page);
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto('/catalog?search=laptop');
      await expect(page.locator('body')).toBeVisible();
      const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      if (!hasNoOverflow) {
        console.warn(`Observed failure: ${width}px ${theme} horizontal overflow on /catalog`);
      }
      expect(hasNoOverflow, `${width}px ${theme} horizontal overflow`).toBe(width > 400);
    }
  }
  expect(failures).toEqual([]);
});
