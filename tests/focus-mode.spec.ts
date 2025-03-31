import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.goto('/');
});
// Helper function to enter focus mode reliably
async function enterFocusMode(page: Page) {
  const focusModeButton = page.locator('[data-testid="focus-mode-button"]');
  const focusContainer = page.locator('[data-testid="focus-mode-container"]');
  // Define the locator for an element guaranteed to be inside the container
  const exitButton = focusContainer.locator('[data-testid="exit-focus-mode-button"]');

  // Ensure button is ready before clicking
  await expect(focusModeButton).toBeVisible();
  await expect(focusModeButton).toBeEnabled();

  await focusModeButton.click();

  // Wait specifically for the Exit button inside the container first
  await expect(exitButton).toBeVisible({ timeout: 10000 });

  // Then confirm container is also visible
  await expect(focusContainer).toBeVisible();

  await expect(focusContainer.locator('[data-testid="focus-wpm-control"]')).toBeVisible({ timeout: 1000 });

  return focusContainer; // Return locator for chaining if needed
}


test('should enter and exit focus mode', async ({ page }: { page: Page }) => {
  const focusContainer = page.locator('[data-testid="focus-mode-container"]');

  // Assert initial state
  await expect(focusContainer).not.toBeVisible();

  // Enter focus mode using the helper
  await enterFocusMode(page);

  // Locate exit button *after* container is visible
  const exitButton = focusContainer.locator('[data-testid="exit-focus-mode-button"]');
  await expect(exitButton).toBeVisible(); // Ensure exit button is there

  // Exit focus mode
  await exitButton.click();
  await expect(focusContainer).not.toBeVisible();
});

test('should exit focus mode with Escape key', async ({ page }: { page: Page }) => {
  const focusContainer = page.locator('[data-testid="focus-mode-container"]');

  // Enter focus mode
  await enterFocusMode(page);

  // Exit with Escape
  await page.press('body', 'Escape');
  await expect(focusContainer).not.toBeVisible();
});

test('should control playback within focus mode', async ({ page }: { page: Page }) => {
  // Enter focus mode
  const focusContainer = await enterFocusMode(page);

  // Locators relative to the container
  const playButton = focusContainer.locator('[data-testid="focus-play-button"]');
  const pauseButton = focusContainer.locator('[data-testid="focus-pause-button"]');
  const resetButton = focusContainer.locator('[data-testid="focus-reset-button"]');
  const wordDisplay = focusContainer.locator('.grid.grid-cols-\\[1fr_auto_1fr\\]');
  const progressBar = focusContainer.locator('.relative.w-full.h-1\\.5'); // Using specific class from FocusMode.tsx

  // Initial state check
  await expect(playButton).toBeVisible();
  await expect(pauseButton).not.toBeVisible();

  // Click Play
  await playButton.click();
  await expect(pauseButton).toBeVisible();
  await expect(playButton).not.toBeVisible();

  // Click Pause
  await pauseButton.click();
  await expect(playButton).toBeVisible();
  await expect(pauseButton).not.toBeVisible();

  // Start playing again to ensure isPlaying is true
  await playButton.click();
  await expect(pauseButton).toBeVisible(); // Confirm playing state
  await page.waitForTimeout(500); // Short wait for word to potentially change

  // Click the focus mode Reset button (which now also pauses)
  await resetButton.click();

  await expect(playButton).toBeVisible({ timeout: 5000 });
  await expect(pauseButton).not.toBeVisible();

  // 2. Assert word display resets to the first word ('Welcome' -> pivot 'l')
  // This assertion should now pass reliably because playback is stopped.
  await expect(wordDisplay.locator('div').nth(1)).toHaveText('l');

  // 3. Assert progress bar resets (check the inner indicator div)
  await expect(progressBar.locator('div').first()).toHaveAttribute('style', /width:\s*0%;/);

  await expect(playButton).toBeVisible();

  // Click reset while paused
  await resetButton.click();

  // Playback state should remain paused
  await expect(playButton).toBeVisible({ timeout: 5000 });
  await expect(pauseButton).not.toBeVisible();

  // Word and progress should still be reset
  await expect(wordDisplay.locator('div').nth(1)).toHaveText('l');
  await expect(progressBar.locator('div').first()).toHaveAttribute('style', /width:\s*0%;/);
  await expect(wordDisplay.locator('div').nth(1)).toHaveText('l');
  await expect(progressBar.locator('div').first()).toHaveAttribute('style', /width:\s*0%;/);

});

test('should adjust settings within focus mode', async ({ page }: { page: Page }) => {
  // Enter focus mode
  const focusContainer = await enterFocusMode(page);

  // Locators relative to the container
  const wpmControl = focusContainer.locator('[data-testid="focus-wpm-control"]');
  const wpmValue = wpmControl.locator('span.font-mono');
  const wpmIncrementButton = wpmControl.locator('button').first();

  const wordsControl = focusContainer.locator('[data-testid="focus-words-control"]');
  const wordsValue = wordsControl.locator('span.font-mono');
  const wordsIncrementButton = wordsControl.locator('button').first();

  const sizeControl = focusContainer.locator('[data-testid="focus-size-control"]');
  const sizeValue = sizeControl.locator('span.font-mono');
  const sizeIncrementButton = sizeControl.locator('button').first();

  // --- WPM Check ---
  const initialWpm = await wpmValue.textContent();
  expect(initialWpm).toMatch(/\d+/); // Should be a number (e.g., 300)
  await expect(wpmValue).toHaveText('300'); // Verify default WPM in focus mode
  await wpmIncrementButton.click();
  await expect(wpmValue).not.toHaveText(initialWpm!);
  await expect(wpmValue).toHaveText('310'); // Default 300 + 10

  // --- Words Check ---
  const initialWords = await wordsValue.textContent();
  await expect(wordsValue).toHaveText('1'); // Default is 1
  await wordsIncrementButton.click();
  await expect(wordsValue).not.toHaveText(initialWords!);
  await expect(wordsValue).toHaveText('2'); // Increment is 1

  // --- Size Check ---
  const initialSize = await sizeValue.textContent();
  await expect(sizeValue).toHaveText('48'); // Default focus mode font size is 48
  await sizeIncrementButton.click();
  await expect(sizeValue).not.toHaveText(initialSize!);
  await expect(sizeValue).toHaveText('50'); // Focus mode size increments by 2
});
