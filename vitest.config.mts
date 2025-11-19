import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      enabled: true,
      include: ['app/**/*', 'lib/**/*', 'types/**/*'],
    },
  },
  resolve: {
    // keep default resolver behavior; tsconfig-paths plugin handles @/ aliases
  },
});
