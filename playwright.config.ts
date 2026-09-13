import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    // Trava se alguém esquecer um `.only` — só importa em CI, local é normal
    // usar `.only` pra depurar um teste específico.
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'github' : 'html',
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    // Builda e serve o bundle de PRODUÇÃO (não o dev server) — é o mais
    // próximo do que realmente vai pro ar, e é o que o CI também roda.
    webServer: {
        command: `npm run build && npm run preview -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
