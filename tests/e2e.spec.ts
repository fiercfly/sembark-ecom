import { test, expect } from '@playwright/test';

test.describe('E-commerce Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('should display product list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Curated Collections');
    const cards = page.locator('.product-card');
    await expect(cards).toHaveCount({ min: 1 });
  });

  test('should filter by category', async ({ page }) => {
    const categoryCheckbox = page.locator('input[type="checkbox"]').first();
    await categoryCheckbox.check();
    await page.waitForURL(/categoryId/);
    await expect(page.url()).toContain('categoryId');
  });

  test('should navigate to product detail and add to cart', async ({ page }) => {
    await page.locator('.product-card').first().click();
    await expect(page.url()).toContain('/product/');
    
    const addButton = page.locator('button:has-text("Add to Cart")');
    await addButton.click();
    
    await page.click('.cart-btn');
    await expect(page.url()).toContain('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });
});
