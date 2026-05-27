import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@checkpoint.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'contraseña';
const GAME_TO_SEARCH = 'The Witcher 3';

test.describe('Flujo 1: Añadir juego desde RAWG', () => {

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

    test('Busca un juego, lo añade y verifica que está en la librería', async ({ page }) => {
        await page.goto('/search');

        const searchInput = page.getByPlaceholder(/Type a game title/i);
        await searchInput.click();
        await searchInput.fill(GAME_TO_SEARCH);
        await page.getByRole('button', { name: /Search games/i }).click();

        const firstGameHeading = page.getByRole('heading', { level: 3 }).first();
        await expect(firstGameHeading).toBeVisible({ timeout: 15000 });

        const exactGameTitle = await firstGameHeading.textContent();
        expect(exactGameTitle).toBeTruthy();

        const addToLibraryButton = page.getByRole('button', { name: 'Library', exact: true }).first();
        await addToLibraryButton.click();

        const saveButton = page.getByRole('button', { name: /Save|Add/i }).first();
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        const goToLibraryModalButton = page.getByRole('button', { name: /Go to Library/i });

        await expect(goToLibraryModalButton).toBeVisible({ timeout: 15000 });
        await goToLibraryModalButton.click();

        const addedGame = page.getByRole('heading', { name: exactGameTitle as string, exact: true }).first();
        await expect(addedGame).toBeVisible({ timeout: 15000 });
    });
});