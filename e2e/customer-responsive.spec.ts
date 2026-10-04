import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/catalog',
  '/catalog?q=laptop',
  '/product/iphone-15-128gb-black',
  '/wishlist',
  '/checkout',
  '/orders',
  '/tlater',
  '/points',
  '/profile',
  '/care',
  '/help',
];

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const THEMES = ['light', 'dark'] as const;

test.describe('Customer Responsive Routes - No Horizontal Overflow', () => {
  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      test(`All routes render without overflow at ${vp.width}px (${theme})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.emulateMedia({ colorScheme: theme });

        await page.addInitScript((t) => {
          localStorage.setItem('theme', t);
        }, theme);

        for (const route of ROUTES) {
          await page.goto(route);
          await page.waitForLoadState('domcontentloaded');

          if (theme === 'dark') {
            await expect(page.locator('html')).toHaveClass(/dark/);
          } else {
            await expect(page.locator('html')).not.toHaveClass(/dark/);
          }

          const overflow = await page.evaluate(() => {
            return {
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
              hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
            };
          });

          expect(
            overflow.hasOverflow,
            `Route ${route} overflowed at ${vp.width}px (${theme}): scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`
          ).toBe(false);
        }
      });
    }
  }
});

test.describe('Customer Interactions, Modals, Short Height, and Non-Empty Cart', () => {
  for (const vp of VIEWPORTS) {
    test(`Mobile/tablet/desktop modals and non-empty cart checkout at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Header theme toggle
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const themeBtn = page.locator('header').getByLabel('Toggle theme');
      await expect(themeBtn).toBeVisible();
      await themeBtn.click();
      await themeBtn.click();

      // 2. Product Detail and Header touch targets >= 40px
      await page.goto('/product/iphone-15-128gb-black');
      await page.waitForLoadState('domcontentloaded');

      const headerInteractive = page.locator('header button, header a');
      const count = await headerInteractive.count();
      for (let i = 0; i < count; i++) {
        const item = headerInteractive.nth(i);
        if (await item.isVisible()) {
          const box = await item.boundingBox();
          if (box) {
            expect(
              box.width >= 40 || box.height >= 40,
              `Header item ${i} size (${box.width}x${box.height}) must have touch target dimension >= 40px`
            ).toBe(true);
          }
        }
      }

      // 3. Guest add-to-cart opens Login Modal
      await page.getByRole('button', { name: '+ Keranjang' }).click();

      const loginHeading = page.getByRole('heading', { name: 'Selamat Datang!' });
      await expect(loginHeading).toBeVisible();

      let overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Login modal caused horizontal overflow').toBe(false);

      // Open Register modal from Login modal
      await page.getByRole('button', { name: 'Daftar Sekarang' }).click();
      await expect(page.getByRole('heading', { name: 'Buat Akun' })).toBeVisible();
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Register modal caused horizontal overflow').toBe(false);

      // Switch back to Login and authenticate
      await page.getByRole('button', { name: 'Masuk di sini' }).click();
      await expect(loginHeading).toBeVisible();
      await page.getByPlaceholder('Email').fill('budi@example.com');
      await page.getByPlaceholder('Password').fill('Demo123!');
      await page.locator('form button[type="submit"]').click();
      await expect(loginHeading).toBeHidden();

      // 4. Authenticated add-to-cart & non-empty Cart Drawer
      await page.getByRole('button', { name: '+ Keranjang' }).click();

      await page.locator('header').getByLabel('Cart').click();
      await expect(page.getByRole('heading', { name: 'Keranjang Belanja' })).toBeVisible();
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Cart drawer caused horizontal overflow').toBe(false);

      // 5. Checkout View with non-empty cart
      await page.getByRole('button', { name: 'Lanjut ke Checkout' }).click();
      await page.waitForURL('/checkout');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Checkout view with items caused horizontal overflow').toBe(false);

      // Promo Modal in Checkout
      const promoTrigger = page.getByText(/Makin hemat pakai promo/i);
      if (await promoTrigger.isVisible()) {
        await promoTrigger.click();
        await expect(page.getByText('Makin hemat pakai promo!')).toBeVisible();
        overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, 'Promo modal caused horizontal overflow').toBe(false);
        await page.getByLabel('Tutup').click();
      }

      // 6. Notification Dropdown
      await page.locator('header').getByLabel('Notifications').click();
      await expect(page.getByRole('heading', { name: 'Notifikasi' })).toBeVisible();
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Notification dropdown caused horizontal overflow').toBe(false);
      await page.keyboard.press('Escape');

      // 7. Orders View, Detail Modal, Tracking Modal
      await page.goto('/orders');
      await page.waitForLoadState('domcontentloaded');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Orders page caused horizontal overflow').toBe(false);

      const detailBtn = page.getByRole('button', { name: /Lihat Detail/i }).first();
      if (await detailBtn.isVisible()) {
        await detailBtn.click();
        await expect(page.getByRole('heading', { name: 'Detail Pesanan' })).toBeVisible();
        overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, 'Order detail modal caused horizontal overflow').toBe(false);
        await page.getByLabel('Tutup').click();
      }

      // 8. TLater Hub & Repay Modal
      await page.goto('/tlater');
      await page.waitForLoadState('domcontentloaded');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'TLater Hub caused horizontal overflow').toBe(false);

      const payBtn = page.getByRole('button', { name: 'Bayar', exact: true }).first();
      if (await payBtn.isVisible()) {
        await payBtn.click();
        await expect(page.getByRole('heading', { name: 'Bayar Angsuran' })).toBeVisible();
        overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, 'Repay modal caused horizontal overflow').toBe(false);
        await page.getByLabel('Tutup').click();
      }

      // 9. Profile & KYC Modal
      await page.goto('/profile');
      await page.waitForLoadState('domcontentloaded');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Profile view caused horizontal overflow').toBe(false);

      const kycBtn = page.getByRole('button', { name: /Verifikasi Sekarang/i });
      if (await kycBtn.isVisible()) {
        await kycBtn.click();
        await expect(page.getByRole('heading', { name: 'Verifikasi Identitas (KYC)' })).toBeVisible();
        overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, 'KYC modal caused horizontal overflow').toBe(false);
        await page.getByLabel('Tutup').click();
      }

      // 10. Care View & Create Ticket Modal
      await page.goto('/care');
      await page.waitForLoadState('domcontentloaded');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Care view caused horizontal overflow').toBe(false);

      const newTicketBtn = page.getByRole('button', { name: 'Buat Tiket Baru' });
      if (await newTicketBtn.isVisible()) {
        await newTicketBtn.click();
        await expect(page.getByRole('heading', { name: 'Buat Tiket Bantuan' })).toBeVisible();
        overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, 'Create ticket modal caused horizontal overflow').toBe(false);
        await page.getByLabel('Tutup').click();
      }

      // 11. Short Viewport Height Test (500px)
      await page.setViewportSize({ width: vp.width, height: 500 });
      await page.goto('/catalog');
      await page.waitForLoadState('domcontentloaded');
      overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, 'Short height caused horizontal overflow').toBe(false);
    });
  }
});
