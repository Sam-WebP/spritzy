import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('should update WPM value', async ({ page }) => {
    const wpmControl = page.locator('[data-testid="wpm-control"]');
    const wpmValue = wpmControl.locator('span.font-mono');
    const incrementButton = wpmControl.locator('button').first();
    const decrementButton = wpmControl.locator('button').nth(1);

    await expect(wpmValue).toHaveText('300');

    await incrementButton.click();
    await expect(wpmValue).toHaveText('310');

    await decrementButton.click();
    await expect(wpmValue).toHaveText('300');
});

test('should update WordsAtTime value and display', async ({ page }) => {
    const wordsControl = page.locator('[data-testid="words-control"]');
    const wordsValue = wordsControl.locator('span.font-mono');
    const incrementButton = wordsControl.locator('button').first();
    const wordDisplay = page.locator('[data-testid="word-display"]');

    await expect(wordsValue).toHaveText('1');

    await incrementButton.click();
    await expect(wordsValue).toHaveText('2');
    await expect(wordDisplay).toContainText('\u00A0', { timeout: 1000 });
});

test('should update Size value', async ({ page }) => {
    const sizeControl = page.locator('[data-testid="size-control"]');
    const sizeValue = sizeControl.locator('span.font-mono');
    const incrementButton = sizeControl.locator('button').first();
    const decrementButton = sizeControl.locator('button').nth(1);

    await expect(sizeValue).toHaveText('24');

    await incrementButton.click();
    await expect(sizeValue).toHaveText('25');

    await decrementButton.click();
    await expect(sizeValue).toHaveText('24');
});
