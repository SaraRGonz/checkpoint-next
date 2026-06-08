import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./setupTests.ts'],
        exclude: ['e2e/**', '**/node_modules/**'], 
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'e2e/**',
                '**/node_modules/**',
                'src/app/api/auth/**',  
                'src/mocks/**',
            ]
        }
    }
});