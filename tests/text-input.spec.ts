import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('should update WordDisplay when text is entered', async ({ page }) => {
    const textArea = page.locator('[data-testid="text-input"]');
    await textArea.fill('New test text.');
    await expect(page.locator('[data-testid="word-display"] div').nth(1))
        .toHaveText('N', { timeout: 1000 });
});

test('should clear WordDisplay when text is cleared', async ({ page }) => {
    const textArea = page.locator('[data-testid="text-input"]');
    await textArea.fill('Some text');
    await expect(page.locator('[data-testid="word-display"] div').nth(1))
        .toBeVisible({ timeout: 1000 });
    await textArea.fill('');
    await expect(page.locator('[data-testid="word-display"] div').nth(1))
        .not.toBeVisible({ timeout: 1000 });
});
