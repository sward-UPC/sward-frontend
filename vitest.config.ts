import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Las pruebas usan la misma configuración que la app (alias @core, @features, …)
// y un DOM simulado.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
    },
  }),
);
