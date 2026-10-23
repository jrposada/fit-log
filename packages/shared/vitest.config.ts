import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Existing `*.test.ts` files hold compile-time type assertions only.
    include: ['src/**/*.spec.ts'],
  },
});
