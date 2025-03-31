import { test, expect } from '@playwright/test';

test('should load with default text and settings', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Spritzy - Speed Reading/);

    const wordDisplay = page.locator('[data-testid="word-display"]');
    await expect(wordDisplay.locator('div').nth(1)).toHaveText('l');

    const wpmValue = page.locator('[data-testid="wpm-control"] span.font-mono');
    await expect(wpmValue).toHaveText('300');

    const wordsValue = page.locator('[data-testid="words-control"] span.font-mono');
    await expect(wordsValue).toHaveText('1');

    const sizeValue = page.locator('[data-testid="size-control"] span.font-mono');
    await expect(sizeValue).toHaveText('24');
});
