import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e', // Directorio donde guardaremos los tests
  fullyParallel: true, // Ejecutar tests en paralelo
  forbidOnly: !!process.env.CI, // Fallar si alguien deja un test.only en CI
  retries: process.env.CI ? 2 : 0, // Reintentos en CI
  workers: process.env.CI ? 1 : undefined, // Optar por un worker en CI
  reporter: 'html', // Generar un reporte HTML
  
  use: {
    baseURL: 'http://localhost:3000', // URL base de la app
    trace: 'on-first-retry', // Recoger trazas solo si el test falla y se reintenta
    video: 'on-first-retry', // Grabar video solo si el test falla y se reintenta
    screenshot: 'only-on-failure' // Tomar captura de pantalla al fallar
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Puedes descomentar estos si quieres probar en más navegadores
    {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
    },
    {
       name: 'webkit',
       use: { ...devices['Desktop Safari'] },
     },
  ],

  // Ejecutar tu servidor de desarrollo automáticamente antes de los tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // Reutilizar si ya lo tienes corriendo
    timeout: 120 * 1000,
  },
});