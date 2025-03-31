import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('should start and pause reading', async ({ page }) => {
    const startButton = page.locator('[data-testid="play-button"]');
    const pauseButton = page.locator('[data-testid="pause-button"]');
    const wordDisplay = page.locator('[data-testid="word-display"]');

    const initialWord = await wordDisplay.textContent();
    await startButton.click();

    await expect(pauseButton).toBeVisible();
    await expect(startButton).not.toBeVisible();

    await page.waitForTimeout(500); // Adjust based on WPM
    const nextWord = await wordDisplay.textContent();
    expect(initialWord).not.toEqual(nextWord);

    await pauseButton.click();
    await expect(startButton).toBeVisible();
    await expect(pauseButton).not.toBeVisible();

    const pausedWord = await wordDisplay.textContent();
    await page.waitForTimeout(500);
    const stillPausedWord = await wordDisplay.textContent();
    expect(pausedWord).toEqual(stillPausedWord);
});

test('should reset reading progress', async ({ page }) => {
    const startButton = page.locator('[data-testid="play-button"]');
    const resetButton = page.locator('[data-testid="reset-button"]');
    const wordDisplay = page.locator('[data-testid="word-display"]');
    const progressIndicator = page.locator('[data-testid="progress-indicator"]');

    await startButton.click();
    await page.waitForTimeout(500);
    await expect(progressIndicator).not.toHaveAttribute('style', /width: 0%;/);

    await resetButton.click();
    await expect(wordDisplay.locator('div').nth(1)).toHaveText('l');
    await expect(progressIndicator).toHaveAttribute('data-state', 'indeterminate');
    await expect(startButton).toBeVisible();
});
