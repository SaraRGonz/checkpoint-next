import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@checkpoint.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'contraseña';

test.describe('Flujo 2: Filtrado por géneros', () => {
  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    await page.goto('/login');

    const emailInput = page.getByPlaceholder('user@mail.com');
    await expect(emailInput).toBeVisible();
    await emailInput.click();
    await emailInput.pressSequentially(TEST_EMAIL, { delay: 50 });

    const passInput = page.locator('input[type="password"]');
    await passInput.click();
    await passInput.pressSequentially(TEST_PASSWORD, { delay: 50 });

    await page.getByRole('button', { name: /Sign in with Email/i }).click();
    await expect(page.getByRole('button', { name: /Log out/i })).toBeVisible({ timeout: 15000 });
  });

  test('Aplica el filtro RPG y verifica la visibilidad', async ({ page }) => {
    await page.goto('/library');

    await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible({ timeout: 15000 });

    const genreLabel = page.getByText('Genre', { exact: true });
    const genreMenuBtn = genreLabel.locator('..').getByRole('button').first();
    await genreMenuBtn.click();

    const rpgOption = page.getByRole('menuitem', { name: 'RPG' }).or(page.getByText('RPG', { exact: true })).first();
    await expect(rpgOption).toBeVisible();
    await rpgOption.click();

    const resetButton = page.getByRole('button', { name: /Reset/i });
    await expect(resetButton).toBeVisible();

    const gameCard = page.getByRole('heading', { name: /The Witcher 3/i }).first();
    await expect(gameCard).toBeVisible();
  });
});