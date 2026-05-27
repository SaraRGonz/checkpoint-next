import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@checkpoint.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'contraseña';

test.describe('Flujo 3: Tablero Kanban y Drag & Drop', () => {
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

    test('Mueve un juego de Queue a Playing y verifica la persistencia', async ({ page }) => {
        await page.goto('/library');

        const kanbanBtn = page.getByRole('button', { name: /Kanban View/i });
        await expect(kanbanBtn).toBeVisible({ timeout: 15000 });
        await kanbanBtn.click();

        const gameCard = page.getByRole('heading', { name: /The Witcher 3/i }).first();
        await expect(gameCard).toBeVisible();

        const playingColumnTarget = page.getByText('Playing', { exact: true }).first();

        await gameCard.dragTo(playingColumnTarget);

        await page.waitForTimeout(1500);

        await page.reload();

        const kanbanBtnReloaded = page.getByRole('button', { name: /Kanban View/i });
        await expect(kanbanBtnReloaded).toBeVisible({ timeout: 15000 });
        await kanbanBtnReloaded.click();

        const reloadedGameCard = page.getByRole('heading', { name: /The Witcher 3/i }).first();
        await expect(reloadedGameCard).toBeVisible();
    });
});