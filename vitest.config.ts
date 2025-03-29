import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts', // We'll create this file next
        // You might want to specify a glob pattern for your test files
        include: ['src/**/*.test.{ts,tsx}', '__tests__/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.next', '.vercel', 'public'],
        coverage: {
            provider: 'v8', // or 'istanbul'
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
