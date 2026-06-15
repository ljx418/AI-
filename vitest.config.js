import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.js', 'src/**/*.spec.ts', 'src/**/*.spec.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**', 'src/utils/**'],
      exclude: ['src/**/*.stories.jsx', 'src/**/*.test.js', 'src/data/**']
    }
  }
});